// Supabase Client Initialization
const SUPABASE_URL = "https://lorhrfdqzagulicwcctx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YxubnsG5x3QD_OaPzEEy_w_wzLVLSlW";

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase Connected Successfully");
