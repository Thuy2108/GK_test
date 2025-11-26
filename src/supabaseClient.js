import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dufqtfeftfhtiptcxviu.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1ZnF0ZmVmdGZodGlwdGN4dml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzUyMzYsImV4cCI6MjA3OTc1MTIzNn0.ch2tE-8n7MjVTtzAcKWtMdQ2OV5QFRoLFpK_QMLA1-Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
