import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('✓ Supabase PostgreSQL client initialized successfully');
  } catch (err) {
    console.warn('! Supabase initialization warning:', err.message);
  }
} else {
  console.log('ℹ Supabase credentials not provided in .env — Running in high-performance local resilient mode');
}

export default supabase;
