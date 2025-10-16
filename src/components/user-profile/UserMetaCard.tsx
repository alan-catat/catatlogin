"use client"

import React, { useState, useEffect } from "react"
import { useModal } from "../../hooks/useModal"
import { Modal } from "../ui/modal"
import Button from "../ui/button/Button"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import { createClient } from "@/utils/supabase/client"
import { useAlert } from "../ui/alert/Alert"
import Image from "next/image";

export default function UserInfoCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
  })
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const supabase = createClient()
  const { setAlertData } = useAlert()

  // Pisahkan nama depan & belakang
  const fullName = profile?.full_name?.trim() || ""
  const phoneNumber = profile?.phone_number?.trim() || ""
  const nameParts = fullName.split(" ")
  const firstName = nameParts[0] || "-"
  const lastName = nameParts.slice(1).join(" ") || "-"

  useEffect(() => {
    // Ambil user login, cek apakah dia super_admin
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(profile?.email ?? null)

      if (user) {
        const { data: superAdmin } = await supabase
          .from("super_admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle()

        setIsSuperAdmin(!!superAdmin)
      }
    }
    fetchUser()
  }, [supabase])

  useEffect(() => {
    const getSignedPhotoUrl = async () => {
      if (!profile?.photo_url) {
        setPhotoUrl("/images/user/edit.png") // fallback langsung
        return
      }

      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .createSignedUrl(profile.photo_url, 60 * 60)

        if (error || !data?.signedUrl) {
          console.warn("Foto tidak ditemukan di Supabase, fallback ke default:", error?.message)
          setPhotoUrl("/images/user/edit.png") // 🚀 fallback
        } else {
          setPhotoUrl(data.signedUrl)
        }
      } catch (err) {
        console.error("Unexpected error ambil foto:", err)
        setPhotoUrl("/images/user/edit.png") // 🚀 fallback
      }
    }

    getSignedPhotoUrl()
  }, [profile?.photo_url, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Jika super admin → update berdasarkan profile.user_id
    // Jika bukan → update hanya dirinya sendiri
    const targetUserId = isSuperAdmin ? profile.user_id : user.id

    const { error } = await supabase
      .from("user_profiles")
      .update({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", targetUserId)

    if (error) {
      setAlertData({
        variant: "error",
        title: "Gagal Update",
        message: error.message
      })
      return
    }

    setAlertData({
      variant: "success",
      title: "Berhasil",
      message: "Profil berhasil diperbarui"
    })
    closeModal()
  }
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={photoUrl || "/images/user/edit.png"}
                alt={profile?.full_name || "user"}
              />

            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {fullName || "-"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userEmail || "-"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
