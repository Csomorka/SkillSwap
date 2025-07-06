import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabaseUrl = "https://vsrqruhbhllseicccnau.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcnFydWhiaGxsc2VpY2NjbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjQ5MjIsImV4cCI6MjA2NTI0MDkyMn0.hzdUIqPJIn39utoCnpuA8PBShpmHGp_6L8v2HRy9aFU";
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    logLevel: "debug",
  },
});

export default supabase;
