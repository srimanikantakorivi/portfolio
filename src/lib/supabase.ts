import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';

// Validate that credentials are genuine and not placeholder strings
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseAnonKey.length > 20
);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

/**
 * Test connectivity to Supabase backend and check table presence
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in environment variables.',
    };
  }

  try {
    // Attempt a lightweight ping to the profile table
    const { error } = await supabase
      .from('portfolio_profile')
      .select('id, name')
      .limit(1);

    if (error) {
      return {
        connected: false,
        message: 'Connected to Supabase endpoint, but database query failed.',
        error: error.message,
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: 'Connection request to Supabase failed.',
      error: errorMsg,
    };
  }
}
