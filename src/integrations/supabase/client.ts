// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://idetrgmboqaoesromrby.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZXRyZ21ib3Fhb2Vzcm9tcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjE0OTYsImV4cCI6MjA2NDE5NzQ5Nn0.6peYm9yANNLElXcZREpTd3WX0Pg9Aeu8JoXPdpHR80U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);