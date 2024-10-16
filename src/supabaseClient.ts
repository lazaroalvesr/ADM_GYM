import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL; // Your Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
