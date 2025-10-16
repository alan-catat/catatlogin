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

export default function UserSocialCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
  })
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()
  // Pisahkan nama depan & belakang
  const fullName = profile?.full_name?.trim() || ""
  const phoneNumber = profile?.phone_number?.trim() || ""
  const nameParts = fullName.split(" ")

  useEffect(() => {
    // Ambil email user sekali waktu komponen mount
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    fetchUser()
  }, [supabase])

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Social Media
            </h4>
            {(phoneNumber || profile?.instagram || profile?.facebook || profile?.tiktok) && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* Telegram */}
                {phoneNumber && (
                  <a
                    href={`https://t.me/+${phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-blue-500"
                    >
                      <path d="M9.999 15.17 8.614 18.91a.75.75 0 0 1-1.45-.04l-1.47-5.58-4.34-1.53a.75.75 0 0 1-.06-1.4l20-8a.75.75 0 0 1 .98.95l-3.5 12a.75.75 0 0 1-1.12.44l-5.5-3.5-2.5 3.92z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Telegram</span>
                  </a>
                )}

                {/* WhatsApp */}
                {phoneNumber && (
                  <a
                    href={`https://wa.me/+${phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-green-500"
                    >
                      <path d="M16.999 14.4c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.6.13-.18.27-.7.87-.85 1.05-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.14-1.31-.79-.7-1.31-1.56-1.46-1.83-.15-.27-.02-.41.11-.54.11-.11.27-.29.4-.43.13-.14.18-.23.27-.38.09-.15.04-.29-.02-.41-.07-.13-.6-1.45-.82-1.98-.21-.5-.43-.43-.6-.43-.15 0-.33-.02-.51-.02s-.47.07-.72.34c-.25.27-.95.93-.95 2.27s.97 2.63 1.1 2.81c.13.18 1.91 2.9 4.63 4.07.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.06-.11-.25-.18-.52-.31z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">WhatsApp</span>
                  </a>
                )}

                {/* Instagram */}
                {profile?.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-pink-500"
                    >
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9zm4.5-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Instagram</span>
                  </a>
                )}

                {/* Facebook */}
                {profile?.facebook && (
                  <a
                    href={`https://facebook.com/${profile.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-blue-600"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.004 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17.004 22 12z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Facebook</span>
                  </a>
                )}

                {/* TikTok */}
                {profile?.tiktok && (
                  <a
                    href={`https://tiktok.com/@${profile.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-lg border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="text-black dark:text-white"
                    >
                      <path d="M12.75 2h2.25a5.25 5.25 0 0 0 5.25 5.25v2.25a7.5 7.5 0 0 1-5.25-2.25V15a7.5 7.5 0 1 1-7.5-7.5h2.25a5.25 5.25 0 1 0 5.25 5.25V2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">TikTok</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
