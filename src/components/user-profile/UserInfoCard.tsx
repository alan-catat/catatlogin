"use client"


import React, { useState, useEffect } from "react"
import { useModal } from "../../hooks/useModal"
import { Modal } from "../ui/modal"
import Button from "../ui/button/Button"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import { createClient } from "@/utils/supabase/client"
import { useAlert } from "../ui/alert/Alert"

export default function UserInfoCard({ profile }: { profile: any }) {
  const { isOpen, openModal, closeModal } = useModal()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
  })
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()
  const { setAlertData } = useAlert()
  const fullName = profile?.full_name?.trim() || "";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "-";
  const lastName = nameParts.slice(1).join(" ") || "-";

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    fetchUserEmail()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    // ambil input dari form
    const firstName = (document.querySelector<HTMLInputElement>('input[name="firstName"]')?.value || "").trim();
    const lastName = (document.querySelector<HTMLInputElement>('input[name="lastName"]')?.value || "").trim();
    const countryCode = (document.querySelector<HTMLInputElement>('input[name="country_code"]')?.value || "").trim();
    const phoneNumber = (document.querySelector<HTMLInputElement>('input[name="phone_number"]')?.value || "").trim();
    const gender = (document.querySelector<HTMLSelectElement>('select[name="gender"]')?.value || "").trim();
    const dateOfBirth = (document.querySelector<HTMLInputElement>('input[name="date_of_birth"]')?.value || "").trim();

    // ambil input sosmed
    const instagram = (document.querySelector<HTMLInputElement>('input[name="instagram"]')?.value || "").trim();
    const facebook = (document.querySelector<HTMLInputElement>('input[name="facebook"]')?.value || "").trim();
    const tiktok = (document.querySelector<HTMLInputElement>('input[name="tiktok"]')?.value || "").trim();

    // ambil file dari input
    const fileInput = document.querySelector<HTMLInputElement>('input[name="profile_photo"]');
    let photoUrl: string | null = profile?.photo_url || null;

    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}_${Date.now()}.${fileExt}`;
      const filePath = `${profile.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setAlertData({
          variant: "error",
          title: "Gagal Upload Foto",
          message: uploadError.message
        });
        return;
      }

      photoUrl = filePath;
    }
    let finalPhone = phoneNumber;
    if (countryCode && !phoneNumber.startsWith(countryCode)) {
      finalPhone = `${countryCode}${phoneNumber}`;
    }
    // payload update
    const payload = {
      full_name: `${firstName} ${lastName}`.trim(),
      phone_number: finalPhone || null,
      gender: gender || null,
      date_of_birth: dateOfBirth || null,
      photo_url: photoUrl || profile?.photo_url || null,
      instagram: instagram || null,
      facebook: facebook || null,
      tiktok: tiktok || null,
      updated_at: new Date().toISOString()
    };

    // update ke DB sesuai user_id dari profile, bukan dari getUser()
    console.log(profile.user_id);
    const { data, error } = await supabase
      .from("user_profiles")
      .update(payload)
      .eq("user_id", profile.user_id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      setAlertData({
        variant: "error",
        title: "Gagal Update",
        message: error.message
      });
      return;
    }

    console.log("Update success:", data);
    setAlertData({
      variant: "success",
      title: "Berhasil",
      message: "Profil berhasil diperbarui"
    });
    closeModal();

    // ✅ langsung refresh
    window.location.reload();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {firstName || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {lastName || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile?.email || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile?.phone_number || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Gender
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile?.gender
                  ? profile.gender === "L"
                    ? "male"
                    : profile.gender === "P"
                      ? "female"
                      : "-"
                  : "-"}
              </p>
            </div>


            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of Birth
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profile?.date_of_birth || "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form
            className="flex flex-col"
            method="POST"
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  {/* First Name */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input
                      name={`firstName`}
                      type="text"
                      defaultValue={firstName || ""}
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name - optional */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name (Optional)</Label>
                    <Input
                      name={`lastName`}
                      type="text"
                      defaultValue={lastName || ""}
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Email - read-only */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      defaultValue={userEmail || ""}
                      readOnly disabled
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-span-2 lg:col-span-2">
                    <Label>Phone</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Kode negara */}
                      <div className="col-span-1 flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-gray-300 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                          +
                        </span>
                        <Input
                          name={`country_code`}
                          type="number"
                          placeholder="62"
                          defaultValue={profile?.country_code || "62"}
                          className="rounded-l-none"
                        />
                      </div>

                      {/* Nomor telepon */}
                      <div className="col-span-2">
                        <Input
                          name={`phone_number`}
                          type="tel"
                          placeholder="81234567890"
                          defaultValue={profile?.phone_number || ""}
                        />
                      </div>
                    </div>
                  </div>


                  {/* Gender */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Gender</Label>
                    <select
                      name={`gender`}
                      className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
                      defaultValue={profile?.gender || ""}
                    >
                      <option value="">Select gender</option>
                      <option value="L">Male</option>
                      <option value="P">Female</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Date Of Birth</Label>
                    <Input
                      name={`date_of_birth`}
                      type="date"
                      defaultValue={profile?.date_of_birth || ""}
                    />
                  </div>
                  {/* Instagram */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Instagram</Label>
                    <Input
                      name={`instagram`}
                      type="text"
                      defaultValue={profile?.instagram || ""}
                      placeholder="@username / URL"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Facebook</Label>
                    <Input
                      name={`facebook`}
                      type="text"
                      defaultValue={profile?.facebook || ""}
                      placeholder="Profile URL"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="col-span-2 lg:col-span-1">
                    <Label>TikTok</Label>
                    <Input
                      name={`tiktok`}
                      type="text"
                      defaultValue={profile?.tiktok || ""}
                      placeholder="@username / URL"
                    />
                  </div>

                  {/* Upload Photo */}
                  <div className="col-span-2">
                    <Label>Profile Photo</Label>
                    <input
                      type="file"
                      name="profile_photo"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-200 dark:file:bg-gray-700 dark:hover:file:bg-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
              >
                Save Changes
              </Button>

            </div>
          </form>

        </div>
      </Modal>
    </div>
  );
}
