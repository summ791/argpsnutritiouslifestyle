import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngktjdmfhvceniikjgpz.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na3RqZG1maHZjZW5paWtqZ3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjQwNDYsImV4cCI6MjA5MzU0MDA0Nn0.Siq6KPPiaYN1lIJSSSpN-n0BcxrV8CwzXqWdbuvOJS4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
