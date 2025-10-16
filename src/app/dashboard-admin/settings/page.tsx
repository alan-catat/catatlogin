"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { settingsTabs, defaultSystemKeys } from "@/config/variables";
import RolesManager from "./RolesManager";

export default function SettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("general");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  // 🔹 system_settings state
  const [formData, setFormData] = useState(defaultSystemKeys);
  const [type, setType] = useState<"manual" | "gateway">("manual");
  const [config, setConfig] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [isActiveMethod, setIsActiveMethod] = useState(false);
  // 🔹 payment_methods state
  const [paymentData, setPaymentData] = useState<any>({
    type: "",
    config: {},
  });

  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // 🔹 Load data awal
  // 🔹 Load data awal
  useEffect(() => {
    const init = async () => {
      // cek role user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("super_admins")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (data?.role === "super_admin") {
          setIsSuperAdmin(true);
        }
      }

      // load system_settings
      const { data: sysData, error: sysError } = await supabase
        .from("system_settings")
        .select("key, value");

      if (sysError) {
        console.error("Fetch settings error:", sysError);
      } else if (sysData) {
        const newData: any = { ...defaultSystemKeys };
        sysData.forEach((row: any) => {
          newData[row.key] = row.value;
        });
        setFormData(newData);
      }

      // load semua payment_methods
      const { data: payData, error: payError } = await supabase
        .from("payment_methods")
        .select("*");

      if (payError) {
        console.error("Fetch payment error:", payError);
      } else if (payData && payData.length > 0) {
        // misal ambil yang pertama, atau sesuai `type` default
        const method =
          payData.find((m: any) => m.type === paymentData.type) || payData[0];

        if (method) {
          const configRows = Object.entries(method.config || {}).map(
            ([key, value]: any, idx: number) => ({
              idx,
              key,
              value,
            })
          );

          setPaymentData({
            type: method.type,
            rows: configRows,
          });
        }
      }
    };

    init();
  }, [supabase]);
  useEffect(() => {
    const fetchPayment = async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*");

      if (error) {
        console.error("Fetch payment error:", error);
        return;
      }

      if (data && data.length > 0) {
        // Cari sesuai type yang dipilih di state
        const method =
          data.find((m: any) => m.type === paymentData.type) || data[0];

        const configRows = Object.entries(method.config || {}).map(
          ([key, value]: any, idx: number) => ({
            idx,
            key,
            value,
          })
        );

        setPaymentData({
          type: method.type,
          rows: configRows,
        });
      }
    };

    fetchPayment();
  }, [paymentData.type]);
  // Load PAYMENT_METHOD dari system_settings
  useEffect(() => {
    const loadActiveMethod = async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "PAYMENT_METHOD")
        .single();

      if (!error && data) {
        setIsActiveMethod(data.value === paymentData.type);
      }
    };

    if (paymentData.type) {
      loadActiveMethod();
    }
  }, [paymentData.type]);


  // 🔹 Save system_settings
  const handleSaveSettings = async () => {
    setLoading(true);

    let keysToSave: string[] = [];
    if (activeTab === "general") {
      keysToSave = ["APP_NAME", "DEFAULT_CURRENCY", "TIMEZONE"];
    } else if (activeTab === "logo") {
      keysToSave = ["LOGO_APP", "LOGO_FAVICON", "LOGO_DARK"];
    }

    for (const key of keysToSave) {
      const value = formData[key as keyof typeof formData];
      if (value === undefined) continue;

      const { error } = await supabase
        .from("system_settings")
        .upsert({ key, value }, { onConflict: "key" });

      if (error) {
        console.error(`Save error for ${key}:`, error.message, error.details);
      }
    }

    setLoading(false);
    alert("Settings saved!");
  };

  // simpan (insert atau update)
  const handleSavePayment = async () => {
    setLoading(true);

    // rakit config jadi object
    const configObject: Record<string, string> = {};
    (paymentData.rows || []).forEach((c: any) => {
      if (c.key) configObject[c.key] = c.value;
    });


    // Insert / update payment_methods
    const { error: pmError } = await supabase.from("payment_methods").upsert({
      type: paymentData.type,
      config: configObject,
      updated_at: new Date().toISOString(),
    });

    if (pmError) {
      console.error("Save payment error:", pmError.message);
      alert("Gagal simpan payment.");
      setLoading(false);
      return;
    }

    // Jika dicentang, update system_settings
    if (isActiveMethod) {
      const { error: ssError } = await supabase
        .from("system_settings")
        .update({ value: paymentData.type })
        .eq("key", "PAYMENT_METHOD");

      if (ssError) {
        console.error("Update PAYMENT_METHOD error:", ssError.message);
      }
    }

    try {
      // cek apakah sudah ada row dengan type ini
      const { data: existing, error: checkError } = await supabase
        .from("payment_methods")
        .select("id")
        .eq("type", type)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // sudah ada → update
        const { error: updateError } = await supabase
          .from("payment_methods")
          .update({ config: configObject })
          .eq("id", existing.id);

        if (updateError) throw updateError;
        alert("Payment method updated!");
      } else {
        // belum ada → insert baru
        const { error: insertError } = await supabase
          .from("payment_methods")
          .insert({ type, config: configObject });

        if (insertError) throw insertError;
        alert("Payment method saved!");
      }
    } catch (err: any) {
      console.error("Save payment error:", err.message);
      alert("Gagal simpan payment.");
    } finally {
      setLoading(false);
    }
  };


  // 🔹 Upload file (untuk logo & payment icon)
  const handleFileUpload = async (
    file: File,
    key: string,
    isPayment: boolean = false
  ) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (data.url) {
      if (isPayment) {
        setPaymentData((prev: any) => ({ ...prev, [key]: data.url }));
      } else {
        setFormData((prev) => ({ ...prev, [key]: data.url }));
      }
    } else {
      alert("Upload gagal");
    }
  };

  const callbackUrl =
    typeof window !== "undefined"
      ? `https://app.catatin.ai/auth/callback`
      : "";

      return (
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Settings
            </h2>
            <ul className="space-y-2">
              {settingsTabs.map((tab, idx) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 text-xs">
                      {idx + 1}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
      
          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* === GENERAL === */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  General Settings
                </h3>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    App Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    value={formData.APP_NAME ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, APP_NAME: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Default Currency
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    value={formData.DEFAULT_CURRENCY ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, DEFAULT_CURRENCY: e.target.value })
                    }
                  >
                    <option value="">-- Select Currency --</option>
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    value={formData.TIMEZONE ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, TIMEZONE: e.target.value })
                    }
                  >
                    <option value="">-- Select Timezone --</option>
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg mt-6 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
      
            {/* === LOGO === */}
            {activeTab === "logo" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Logo Settings
                </h3>
                {["LOGO_APP", "LOGO_FAVICON", "LOGO_DARK"].map((key) => (
                  <div key={key}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key}
                    </label>
                    <input
                      type="file"
                      className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      onChange={(e) =>
                        e.target.files && handleFileUpload(e.target.files[0], key)
                      }
                    />
                    <img
                      src={(formData as any)[key] || "/next.svg"}
                      alt={key}
                      className="h-16 mt-2 border rounded dark:border-gray-700"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg mt-6 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
      
            {/* === PAYMENT === */}
            {activeTab === "payment" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Payment Methods
                </h3>
                <select
                  className="w-full border rounded px-3 py-2 mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  value={paymentData.type ?? ""}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, type: e.target.value, rows: [] })
                  }
                >
                  <option value="">-- Pilih Metode --</option>
                  <option value="manual">Manual</option>
                  <option value="gateway">Gateway</option>
                </select>
      
                {/* TABLE */}
                {paymentData.type && (
                  <div>
                    <table className="w-full border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="border px-3 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                            Key
                          </th>
                          <th className="border px-3 py-2 text-left dark:border-gray-700 dark:text-gray-200">
                            Value
                          </th>
                          <th className="border px-3 py-2 w-20 dark:border-gray-700"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentData.rows?.map((row: any, idx: number) => (
                          <tr key={idx} className="border-t dark:border-gray-700">
                            <td className="border px-3 py-2 dark:border-gray-700">
                              <input
                                type="text"
                                value={row.key}
                                onChange={(e) => {
                                  const newRows = [...paymentData.rows];
                                  newRows[idx].key = e.target.value;
                                  setPaymentData({ ...paymentData, rows: newRows });
                                }}
                                className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                              />
                            </td>
                            <td className="border px-3 py-2 dark:border-gray-700">
                              {paymentData.type === "manual" ? (
                                <div>
                                  <input
                                    type="file"
                                    onChange={async (e) => {
                                      if (e.target.files) {
                                        const file = e.target.files[0];
                                        const fd = new FormData();
                                        fd.append("file", file);
      
                                        const res = await fetch("/api/upload", {
                                          method: "POST",
                                          body: fd,
                                        });
                                        const data = await res.json();
      
                                        if (data.url) {
                                          const newRows = [...paymentData.rows];
                                          newRows[idx].value = data.url;
                                          setPaymentData({
                                            ...paymentData,
                                            rows: newRows,
                                          });
                                        } else {
                                          alert("Upload gagal");
                                        }
                                      }
                                    }}
                                    className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                  />
                                  {row.value && (
                                    <img
                                      src={row.value}
                                      alt="Uploaded"
                                      className="h-12 mt-2 border rounded dark:border-gray-700"
                                    />
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={row.value}
                                  onChange={(e) => {
                                    const newRows = [...paymentData.rows];
                                    newRows[idx].value = e.target.value;
                                    setPaymentData({ ...paymentData, rows: newRows });
                                  }}
                                  className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                />
                              )}
                            </td>
                            <td className="border px-3 py-2 text-center dark:border-gray-700">
                              <button
                                type="button"
                                onClick={() => {
                                  const newRows = paymentData.rows.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  setPaymentData({ ...paymentData, rows: newRows });
                                }}
                                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
      
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={isActiveMethod}
                        onChange={(e) => setIsActiveMethod(e.target.checked)}
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Jadikan metode ini sebagai pembayaran aktif (production)
                      </label>
                    </div>
      
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentData({
                          ...paymentData,
                          rows: [...(paymentData.rows || []), { key: "", value: "" }],
                        })
                      }
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      + Tambah Row
                    </button>
                  </div>
                )}
      
                <button
                  onClick={handleSavePayment}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg mt-6 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading ? "Saving..." : "Save Payment"}
                </button>
              </div>
            )}
      
            {/* === ACCOUNT === */}
            {activeTab === "account" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Account Settings
                </h3>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
      
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
      
                <button
                  onClick={async () => {
                    if (!newPassword || !confirmPassword)
                      return alert("Password tidak boleh kosong");
                    if (newPassword !== confirmPassword)
                      return alert("Password tidak sama!");
      
                    const { error } = await supabase.auth.updateUser({
                      password: newPassword,
                    });
                    if (error) {
                      console.error(error);
                      alert("Gagal update password");
                    } else {
                      alert("Password berhasil direset!");
                      setNewPassword("");
                      setConfirmPassword("");
                    }
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Reset Password
                </button>
              </div>
            )}
      
            {/* === API SETTINGS === */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  API Settings
                </h3>
      
                {/* Auth Callback URL */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auth Callback URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      value={callbackUrl}
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(callbackUrl)}
                      className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Salin URL ini dan daftarkan di Supabase Dashboard → Authentication → Settings → Redirect URLs
                  </p>
                </div>
      
                {/* Midtrans Webhook URL */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Midtrans Webhook URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      className="flex-1 border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      value={`https://app.catatin.ai/api/midtrans/webhook`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(`https://app.catatin.ai/api/midtrans/webhook`)
                      }
                      className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Salin URL ini dan daftarkan di Midtrans Dashboard → Settings → Webhook
                  </p>
                </div>
              </div>
            )}
      
            {/* === ROLES === */}
            {activeTab === "roles" && isSuperAdmin && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Admin Roles
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Hanya super admin yang bisa mengatur role.
                </p>
                <RolesManager supabase={supabase} />
              </div>
            )}
      
            {activeTab === "roles" && !isSuperAdmin && (
              <p className="text-red-500">You don’t have access to this section.</p>
            )}
          </div>
        </div>
      );
      
}
