'use server';

import { sendMessage as sendMessageService } from '@/lib/services/ai';
import { AiConversation } from '@/lib/types/ai';

export async function sendMessage(teacherId: string, message: string, conversationId?: string) {
  try {
    const result = await sendMessageService(teacherId, message, conversationId);
    
    if (!conversationId && result.newConversation) {
      const newConversation: AiConversation = {
        id: result.conversationId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return {
        message: result.message,
        newConversation,
      };
    }

    return {
      message: result.message,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}
