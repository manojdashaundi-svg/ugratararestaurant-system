// Supabase Library बाट Client बनाउने

const SUPABASE_URL = "https://xxxxxxxxxxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "तपाईंको_वास्तविक_publishable_anon_key";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase Connected");
