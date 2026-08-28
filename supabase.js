import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Substitui pelos dados reais da tua consola do Supabase (Settings -> API)
const SUPABASE_URL = 'O_TEU_SUPABASE_URL_AQUI';
const SUPABASE_ANON_KEY = 'A_TUA_CHAVE_ANON_AQUI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
