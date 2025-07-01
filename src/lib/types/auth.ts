// Authentication error types
export type AuthError = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'EMAIL_NOT_CONFIRMED'
  | 'TOO_MANY_ATTEMPTS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Authentication result types
export interface AuthResult {
  success: boolean;
  error?: AuthError;
  message?: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string>;
}

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  school_id?: string;
  school?: {
    name: string;
  };
  school_name?: string; // For backwards compatibility
  settings: {
    language: string;
    is_social_enabled: boolean;
  };
  created_at: string;
  updated_at: string;
}

// School type
export interface School {
  id: string;
  name: string;
  country?: string;
  city?: string;
}

// Auth context type
export interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
