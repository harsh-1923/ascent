import { createClient } from "@supabase/supabase-js";

// Environment variables (for reference)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Hardcoded values for now
const supabaseUrl = "https://zwcchdgvqsnxpotuvewl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Y2NoZGd2cXNueHBvdHV2ZXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzM5NjEsImV4cCI6MjA2OTgwOTk2MX0.RE7WvW5LmzEGdZErDmczfn63wLVlUS4j4v33sNI41zM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface CraftLike {
  id: string;
  craft_id: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}
