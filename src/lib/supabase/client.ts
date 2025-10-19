import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Create a singleton Supabase client for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export a function to create client instances (for compatibility)
export function createClient() {
  return supabase;
}

// API call helper function
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  authenticated: boolean = false
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if authenticated
  if (authenticated) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API call failed: ${response.statusText}`);
  }

  return response.json();
}
