// Supabase client - will use mock DB when no credentials are configured
// To connect to real Supabase, add your credentials to .env.local

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// For now, we use mock-db. When Supabase is configured,
// this file will export real Supabase client.
export { mockDb as db } from './mock-db';
