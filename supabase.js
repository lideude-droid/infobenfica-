import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://inveobojsaijgycxcerg.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoiaW52ZW9ib2pzYWlqZ3l4Y2NlcmciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NzkwODc5NiwiZXhwIjoyMTAzNDg0Nzk2fQ.IuGAuuPFudVZOOD9YPBhOulKATDEUoNx2FlAgI0P-2U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
