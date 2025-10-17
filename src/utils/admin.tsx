// utils/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

// Ambil environment variable dari server
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validasi agar tidak kosong
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ Missing Supabase server environment variables");
}

// Buat client admin (hanya untuk server)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
