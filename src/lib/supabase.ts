import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🌟 This exports the client connection directly from your lib folder!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);