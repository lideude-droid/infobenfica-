import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://inveobojsaijgycxcerg.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_iIKDTsncUlBiImAiSqABNg_n6Ur-rjx';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
