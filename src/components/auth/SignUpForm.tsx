"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();

  // 🧠 STATE
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🌐 URL webhook n8n
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

  // ✅ Handle Manual Sign-Up → kirim ke n8n
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Timestamp: new Date().toISOString(),
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
        }),
      });
let data;
  const text = await response.text(); // ambil dulu sebagai teks mentah
  try {
    data = JSON.parse(text); // coba parse jadi JSON
  } catch {
    data = text; // kalau gagal, berarti dia teks biasa
  }

      if (typeof data === "string") {
    // responsnya bukan JSON
    if (data.toLowerCase().includes("sudah terdaftar")) {
      setErrorMsg("Anda sudah terdaftar, silakan login.");
    } else {
      setErrorMsg(data);
    }
  } else if (data.success) {
    // JSON valid dan sukses
    router.push("/check-email");
  } else {
    // JSON valid tapi gagal
    if (data.error === "User already registered") {
      setErrorMsg("Anda sudah terdaftar, silakan login.");
    } else {
      setErrorMsg("Failed to register: " + (data.error || "Unknown error"));
    }
  }
    } catch (err) {
  console.error("Webhook error:", err);
  setErrorMsg("Gagal terhubung ke server. Silakan coba lagi nanti.");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your details to create your account
          </p>
        </div>

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
              Or
            </span>
          </div>
        </div>

        {errorMsg && <div className="mt-4 text-red-500 text-sm">{errorMsg}</div>}

        <form onSubmit={handleSignUp}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name*</Label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <Label>Email*</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label>Password*</Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                className="w-5 h-5"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                By creating an account you agree to the{" "}
                <span className="text-gray-800 dark:text-white/90">
                  Terms and Conditions
                </span>{" "}
                and our{" "}
                <span className="text-gray-800 dark:text-white">
                  Privacy Policy
                </span>
              </p>
            </div>

            <Button
              className="w-full"
              size="sm"
              type="submit"
              disabled={loading || !isChecked}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
                            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
    <Link
      href="/landing"
      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
    >
      ← Kembali ke halaman utama
    </Link>
  </p>
          </div>
        </form>
      </div>
    </div>
  );
}
