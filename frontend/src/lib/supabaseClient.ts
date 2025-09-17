// This Supabase client will be automatically configured by Dyad
// The environment variables will be injected during the build process
import { createClient } from '@supabase/supabase-js'

// These will be provided by Dyad through environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Supabase features will be disabled.')
  supabase = null
} else {
  try {
    // Validate URL format
    new URL(supabaseUrl)
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.error('Invalid Supabase URL:', supabaseUrl)
    console.warn('Supabase features will be disabled due to invalid configuration.')
    supabase = null
  }
}

// Export the Supabase client (may be null if not configured)
export { supabase }