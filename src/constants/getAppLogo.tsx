import { createClient } from "@/utils/supabase/client";
import { ENVIRONMENT_SYSTEM } from "@/constants/test-data";

const supabase = createClient();

export const getAppLogo = async (): Promise<string> => {
  // Cek di system_settings apakah ada key LOGO_APP
  const { data, error } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "LOGO_APP")
    .single();

  if (error) {
    console.error("Failed to fetch app logo:", error);
    // fallback ke default
    return ENVIRONMENT_SYSTEM.appLogo;
  }

  // Jika ada value, pakai itu, kalau null/empty fallback ke default
  return data?.value || ENVIRONMENT_SYSTEM.appLogo;
};
