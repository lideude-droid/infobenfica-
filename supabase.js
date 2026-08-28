// Configuração do Supabase com a chave anon oficial
const SUPABASE_URL = "https://inveobojsaijgycxcerg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludmVvYm9qc2Fpamd5Y3hjZXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDg3OTYsImV4cCI6MjEwMzQ4NDc5Nn0.IuGAuuPFudVZOOD9YPBhOulKATDEUoNx2FlAgI0P-2U";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
