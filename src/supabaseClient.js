import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vvinjbjradfidrahqqls.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aW5qYmpyYWRmaWRyYWhxcWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzkxMDQsImV4cCI6MjA3NzU1NTEwNH0.MwD9XH1BJlsZO7doynjb2Z-E-e9AhL7SOHrK90bRL2g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
