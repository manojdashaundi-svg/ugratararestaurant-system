// Supabase Library बाट Client बनाउने

const SUPABASE_URL = "https://lorhrfdqzagulicwcctx.supabase.co";

const SUPABASE_ANON_KEY = "यहाँ Supabase को Publishable key पूरा Paste गर्नुहोस्";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase Connected");
