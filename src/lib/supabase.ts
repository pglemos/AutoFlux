import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const checkSupabaseCredentials = (url?: string, key?: string) => {
    if (!url || !key) {
        console.warn('Supabase credentials missing. Check your .env file.')
    }
}

checkSupabaseCredentials(supabaseUrl, supabaseAnonKey)

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
