// Supabase Library बाट Client बनाउने

const SUPABASE_URL = "https://lorhrfdqzagulicwcctx.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_YxubnsG5x3QD_OaPzEEy_w_wzLVLSlW";

// Supabase Connect
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase Connected");
