import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uflloxvnjbbuqxqgkgqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbGxveHZuamJidXF4cWdrZ3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyOTk3ODUsImV4cCI6MjEwMzg3NTc4NX0.IReSWvlOT_jrP0qDkiXW9Kn7YrhY_R1Hdrbu-DxZQ9M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
