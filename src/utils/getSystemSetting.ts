// utils/getSystemSetting.ts
import { createClient } from "@/utils/supabase/server"

export async function getSystemSetting(key: string) {
  const supabase = createClient()
  const { data, error } = await (await supabase)
    .from("system_settings")
    .select("value")
    .eq("key", key)
    .single()
  if (error) throw error
  return data.value
}
