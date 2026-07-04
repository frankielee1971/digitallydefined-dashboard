import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/Database';

// Client-side Supabase client (uses anon key)
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseService = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper to get the appropriate client based on environment
export const getSupabaseClient = () => {
  // In serverless functions, use service role for admin operations
  if (typeof window === 'undefined') {
    return supabaseService;
  }
  return supabase;
};