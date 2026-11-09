
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hpglnjdhztfluvomdzkz.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_UlE_TXLXaZVEaJKpL5jeJw_hFSQCCWv";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);