import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceRoleClient } from '@/utils/supabase/service';

export interface UsageLimit {
  daily: number;
  monthly?: number;
  plan: 'free' | 'premium' | 'unlimited';
}

export interface UsageCheck {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  plan: string;
}

export async function checkUsageLimit(
  userId: string, 
  featureType: string
): Promise<UsageCheck> {
  const supabase = await createClient();
  
  try {
    // Get user's current limits
    const { data: limits } = await supabase
      .from('ai_usage_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!limits) {
      // Create default limits for new user
      await supabase
        .from('ai_usage_limits')
        .insert({
          user_id: userId,
          plan_type: 'free',
          daily_limit: 50,
        });
      
      return {
        allowed: true,
        remaining: 50,
        resetTime: getNextResetTime(),
        plan: 'free',
      };
    }

    // Count today's usage
    const today = new Date().toISOString().split('T')[0];
    const { data: todayUsage, error } = await supabase
      .from('ai_usage_history')
      .select('cost_credits')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) throw error;

    const totalUsed = todayUsage?.reduce((sum, usage) => sum + (usage.cost_credits || 1), 0) || 0;
    const remaining = Math.max(0, limits.daily_limit - totalUsed);
    const allowed = remaining > 0 || limits.plan_type === 'unlimited';

    return {
      allowed,
      remaining,
      resetTime: getNextResetTime(),
      plan: limits.plan_type,
    };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    // Fail open - allow usage if we can't check limits
    return {
      allowed: true,
      remaining: 0,
      resetTime: getNextResetTime(),
      plan: 'unknown',
    };
  }
}

export async function recordUsage(
  userId: string,
  featureType: string,
  creditsUsed: number,
  metadata?: any
): Promise<boolean> {
  const serviceRoleSupabase = await createServiceRoleClient();
  
  try {
    const { error } = await serviceRoleSupabase
      .rpc('check_and_deduct_credits', {
        user_id: userId,
        action_cause: featureType,
        cost_credits: calculateCostCredits(featureType, creditsUsed),
      });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error recording usage:', error);
    return false;
  }
}

export async function getUserUsageStats(userId: string) {
  const supabase = await createClient();
  
  try {
    // Get current limits
    const { data: limits } = await supabase
      .from('ai_usage_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get today's usage
    const today = new Date().toISOString().split('T')[0];
    const { data: todayUsage } = await supabase
      .from('ai_usage_history')
      .select('feature_type, cost_credits, created_at')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    // Get this month's usage
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { data: monthUsage } = await supabase
      .from('ai_usage_history')
      .select('feature_type, cost_credits')
      .eq('user_id', userId)
      .gte('created_at', `${thisMonth}-01T00:00:00.000Z`);

    const todayTotal = todayUsage?.reduce((sum, usage) => sum + (usage.cost_credits || 1), 0) || 0;
    const monthTotal = monthUsage?.reduce((sum, usage) => sum + (usage.cost_credits || 1), 0) || 0;

    // Group usage by feature type
    const usageByFeature = todayUsage?.reduce((acc, usage) => {
      const feature = usage.feature_type;
      acc[feature] = (acc[feature] || 0) + (usage.cost_credits || 1);
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      limits: limits || { daily_limit: 50, plan_type: 'free' },
      today: {
        total: todayTotal,
        remaining: Math.max(0, (limits?.daily_limit || 50) - todayTotal),
        byFeature: usageByFeature,
      },
      month: {
        total: monthTotal,
      },
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}

function calculateCostCredits(featureType: string, tokensUsed?: number): number {
  // Define cost mapping for different features
  const costMap: Record<string, number> = {
    'chat': 1,
    'practice': 5,
    'revision_plan': 3,
    'grading': 5,
  };

  // Ignore this, just for shutting up linter about unused variable
  // tokensUsed might be important in the future
  (tokensUsed => tokensUsed)(tokensUsed);

  return costMap[featureType] || 1;
}

function getNextResetTime(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// export async function upgradePlan(userId: string, newPlan: 'premium' | 'unlimited'): Promise<boolean> {
//   throw new Error("Upgrade plan functionality is not implemented yet.");
// }
