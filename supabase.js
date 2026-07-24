// Supabase Library बाट Client बनाउने

const SUPABASE_URL = "https://lorhrfdqzagulicwcctx.supabase.co";

const SUPABASE_ANON_KEY = "तपाईंको sb_publishable_... key यहाँ राख्नुहोस्";

// Supabase Connect
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase Connected");
