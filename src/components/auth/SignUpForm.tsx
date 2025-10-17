"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/button/Button";

export default function SignUpForm() {
  const supabase = createClient();
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

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  // ✅ Inisialisasi Google Identity Services
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogleSignIn;
        document.body.appendChild(script);
      } else {
        initGoogleSignIn();
      }
    };

    const initGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };

    loadGoogleScript();
  }, []);

  // ✅ Handle Manual Sign-Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/check-email");
    }

    setLoading(false);
  };

  // ✅ Handle Google Sign-Up (Popup)
  const handleGoogleSignUp = () => {
    if (window.google) {
      window.google.accounts.id.prompt({
        use_fedcm_for_prompt: false,
      } as any);
    } else {
      setErrorMsg("Google Sign-In not loaded yet.");
    }
  };

  // ✅ Handle response dari Google
  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: response.credential,
          provider: "google",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/check-email");
      } else {
        setErrorMsg("Google Sign-Up failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Google sign up failed:", err);
      setErrorMsg("Failed to connect to Google Script.");
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

        {/* Google Sign Up */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-5">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.75 10.19c0-.72-.06-1.25-.19-1.79H10.18v3.25h4.92c-.1.81-.64 2.02-1.82 2.83l2.65 2.02c1.69-1.52 2.82-3.77 2.82-6.31Z"
                fill="#4285F4"
              />
              <path
                d="M10.18 18.75c2.41 0 4.43-.78 5.91-2.12l-2.82-2.14c-.76.51-1.77.89-3.09.89-2.36 0-4.36-1.53-5.09-3.64l-2.8 2.09c1.47 2.85 4.49 4.92 7.89 4.92Z"
                fill="#34A853"
              />
              <path
                d="M5.1 11.73a5.38 5.38 0 0 1-.3-1.73c0-.6.1-1.18.29-1.73L2.29 6.03a8.69 8.69 0 0 0 0 7.86l2.81-2.16Z"
                fill="#FBBC05"
              />
              <path
                d="M10.18 4.63c1.68 0 2.81.72 3.45 1.31l2.52-2.42A8.63 8.63 0 0 0 10.18 1.25a8.93 8.93 0 0 0-7.98 4.82l2.89 2.19C5.82 6.16 7.83 4.63 10.18 4.63Z"
                fill="#EB4335"
              />
            </svg>
            Sign up with Google
          </button>
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
          </div>
        </form>
      </div>
    </div>
  );
}
