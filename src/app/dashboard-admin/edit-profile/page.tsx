'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import UserInfoCard from "@/components/user-profile/UserInfoCard"
import UserMetaCard from "@/components/user-profile/UserMetaCard"

export default function Profile() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("user_profiles")
        .select(`
          *,
          groups(name),
          channels(name)
        `)
        .eq("user_id", user.id)
        .is("deleted_at", null)

      if (error) {
        console.error(error)
      }
      if (data && data.length > 0) {
        setProfiles(data)
      } else {
        setProfiles([{
          user_id: user.id,
          full_name: "",
          email: user.email,
          groups: { name: "Tanpa Group" },
          channels: [],
        }])
      }
      setLoading(false)
    }

    fetchProfiles()
  }, [])

  if (loading) return <div>Memuat...</div>

  return (
    <div>
      {profiles.map((profile, index) => (
        <div
          key={index}
          className="mt-6 first:mt-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile {profile.groups?.name || "Tanpa Group"}
          </h3>
          <div className="space-y-10">
            <div className="space-y-6 border-b border-gray-200 pb-6 last:border-none last:pb-0 dark:border-gray-800">
              <UserMetaCard profile={profile} />
              <UserInfoCard profile={profile} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
