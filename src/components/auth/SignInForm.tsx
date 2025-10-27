"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import EyeIcon from "@/icons/EyeIcon";
import EyeCloseIcon from "@/icons/EyeCloseIcon";
import Link from "next/link";

type SignInFormProps = {
  redirectTo: string;
};

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const N8N_WEBHOOK_URL =
    process.env.NEXT_PUBLIC_N8N_SIGNIN_URL ||
    "https://your-n8n-domain.com/webhook/signin";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      // ✅ LOGIN BERHASIL
      if (typeof data === "object" && data.success && data.user) {
        // simpan semua data user yang dikirim dari n8n
        localStorage.setItem("user", JSON.stringify(data.user));

        // beri jeda sedikit agar data tersimpan sebelum redirect
        setTimeout(() => router.push(redirectTo || "/dashboard"), 200);
        return;
      }

      // ✅ jika respon plain text tapi login berhasil
      if (typeof data === "string" && data.toLowerCase().includes("sukses")) {
        // fallback: simpan email saja
        localStorage.setItem(
          "user",
          JSON.stringify({ email, name: email.split("@")[0] })
        );
        setTimeout(() => router.push(redirectTo || "/dashboard"), 200);
        return;
      }

      // ❌ LOGIN GAGAL
      if (typeof data === "string") {
        if (data.toLowerCase().includes("belum terdaftar")) {
          setErrorMsg("Yuk, daftar dulu!");
        } else {
          setErrorMsg(data);
        }
      } else {
        setErrorMsg(data.error || "Email atau password salah.");
      }
    } catch (err) {
      console.error("Webhook error:", err);
      setErrorMsg("Gagal terhubung ke server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {errorMsg && (
            <div className="mt-4 text-red-500 text-sm">{errorMsg}</div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
