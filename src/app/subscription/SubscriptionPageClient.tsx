"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Eye, EyeOff } from "lucide-react";

const steps = ["Registrasi Akun", "Validasi Akun", "Pembayaran", "Selesai"];

export default function SubscriptionPageClient() {
    const searchParams = useSearchParams();
    const stepParam = searchParams.get("step");

    // set default step dari URL, kalau tidak ada -> 0
    const [step, setStep] = useState(stepParam ? parseInt(stepParam, 10) : 0);

    const router = useRouter();
    const supabase = createClient();

    const planName = searchParams.get("plan") || "free";
    const [plan, setPlan] = useState<any>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [proof, setProof] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    // Accordion state
    const [showQRIS, setShowQRIS] = useState(false);
    const [showBank, setShowBank] = useState(false);

    useEffect(() => {
        const stepFromUrl = searchParams.get("step");
        if (stepFromUrl) {
            setStep(parseInt(stepFromUrl, 10));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchPlan = async () => {
            const { data, error } = await supabase
                .from("packages")
                .select(
                    `id, name, price, token_limit, 
           billing_plans (id, billing_cycle, price, duration_days)`
                )
                .eq("name", planName.charAt(0).toUpperCase() + planName.slice(1))
                .single();

            if (!error) setPlan(data);
        };
        fetchPlan();
    }, [planName, supabase]);

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => {
        const newStep = Math.max(step - 1, 0);
        setStep(newStep);
        localStorage.setItem(
            "subscription_progress",
            JSON.stringify({
                step: newStep,
                plan: planName,
                fullName,
                email,
            })
        );
    };

    // ganti saveProgress agar simpan step + plan
    const saveProgress = (stepNumber: number) => {
        setStep(stepNumber);
        localStorage.setItem(
            "subscription_progress",
            JSON.stringify({
                step: stepNumber,
                plan: planName,
                fullName,
                email,
            })
        );
    };

    useEffect(() => {
        const restoreProgress = async () => {
            const { data, error } = await supabase.auth.getUser();

            const saved = localStorage.getItem("subscription_progress");
            const parsed = saved ? JSON.parse(saved) : null;

            if (!error && data?.user) {
                setUserId(data.user.id);

                // isi ulang nama & email dari localStorage kalau ada
                if (parsed) {
                    if (parsed.fullName) setFullName(parsed.fullName);
                    if (parsed.email) setEmail(parsed.email);
                }

                if (!data.user.email_confirmed_at) {
                    setStep(1); // validasi
                } else {
                    setStep(parsed?.step ?? 2); // kalau ada progress lanjut, kalau nggak default ke pembayaran
                }
            } else {
                setStep(0); // registrasi ulang
            }
        };

        restoreProgress();
    }, [supabase]);
    // state tambahan
    const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null);
    const [paymentConfig, setPaymentConfig] = useState<any>({});

    // ambil dari system_settings + payment_methods
    useEffect(() => {
        const loadPaymentSettings = async () => {
            // cek setting aktif
            const { data: sys } = await supabase
                .from("system_settings")
                .select("value")
                .eq("key", "PAYMENT_METHOD")
                .single();

            if (sys?.value) {
                setActivePaymentMethod(sys.value);

                // ambil config payment_methods sesuai type
                const { data: pm } = await supabase
                    .from("payment_methods")
                    .select("config")
                    .eq("type", sys.value)
                    .maybeSingle();

                if (pm?.config) {
                    setPaymentConfig(pm.config);
                }
            }
        };

        loadPaymentSettings();
    }, [supabase]);
    // Step 0: Registrasi
    const handleSignup = async () => {
        if (!termsAccepted) {
            alert("Harap centang Terms & Conditions sebelum mendaftar.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });

        if (error) {
            let friendlyMessage = "Terjadi kesalahan. Silakan coba lagi.";

            if (error.message.includes("invalid email")) {
                friendlyMessage = "Format email tidak valid. Mohon periksa kembali.";
            } else if (error.message.includes("already registered")) {
                friendlyMessage = "Email ini sudah terdaftar. Silakan login atau gunakan email lain.";
            } else if (error.message.includes("password")) {
                friendlyMessage = "Password terlalu lemah. Gunakan minimal 8 karakter dengan huruf & angka.";
            }

            alert(friendlyMessage);
            setLoading(false);
            return;
        }

        alert("Registrasi berhasil 🎉 Silakan cek email Anda untuk konfirmasi.");
        saveProgress(1);
        nextStep(); // -> step 1 validasi akun
        setLoading(false);
    };


    // Step 1: Validasi Akun
    const handleValidate = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            alert("Belum ada konfirmasi email. Cek inbox/spam email Anda.");
            return;
        }
        setUserId(data.user.id);

        // update nama di user_profiles
        await supabase.from("user_profiles").update({
            full_name: fullName,
            terms_accepted: termsAccepted,
            activated_at: new Date().toISOString(),
        }).eq("user_id", data.user.id);
        saveProgress(2);
        nextStep(); // -> step 2 pembayaran
    };

    // Step 2: Pembayaran
    const handlePayment = async () => {
        if (!paymentMethod) return alert("Pilih metode pembayaran");
        if (!plan || !userId) return;

        setLoading(true);
        try {
            const billingPlan = plan.billing_plans.find(
                (bp: any) => bp.billing_cycle === billingCycle
            );

            // Step 1: Insert payment
            const { data: payment } = await supabase
                .from("payments")
                .insert({
                    user_id: userId,
                    amount_payment: billingPlan.price,
                    payment_method: paymentMethod,
                    payment_status: paymentMethod.includes("manual") ? "paid" : "pending",
                    paid_at: paymentMethod.includes("manual") ? new Date().toISOString() : null,
                })
                .select()
                .single();

            // Step 2: Insert transaction
            const { data: transaction } = await supabase
                .from("transactions")
                .insert({
                    billing_plan_id: billingPlan.id,
                    notes: `Transaction for user ${userId}`,
                })
                .select()
                .single();

            // Step 3: Insert transaction_details
            let orderId = `ORD-${Math.floor(Math.random() * 10000) + 1}`;
            let invoiceUrl = "";
            let paymentCode = "";

            if (paymentMethod.includes("manual")) {
                // Manual → generate invoice_url & payment_code dummy
                invoiceUrl = `https://example.com/invoice${orderId}`;
                paymentCode = `PAY${orderId}`;
            } else if (paymentMethod === "gateway") {
                // Gateway → redirect Midtrans, token di-handle di API
                const res = await fetch("/api/midtrans/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        amount: billingPlan.price,
                        items: [
                            {
                                id: billingPlan.id,
                                price: billingPlan.price,
                                quantity: 1,
                                name: plan.name,
                            },
                        ],
                    }),
                });
                const data = await res.json();
                if (data?.redirect_url) {
                    window.location.href = data.redirect_url;
                    return; // langsung redirect ke Midtrans
                } else {
                    throw new Error("Gagal membuat transaksi gateway");
                }
            }

            await supabase.from("transaction_details").insert({
                order_id: orderId,
                gateway: paymentMethod.includes("manual") ? "manual" : "gateway",
                response_payload: JSON.stringify({}),
                invoice_url: invoiceUrl,
                payment_code: paymentCode,
                transaction_id: transaction?.id,
            });

            // Step 4: Insert subscription
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + billingPlan.duration_days);

            await supabase.from("user_subscriptions").insert({
                user_id: userId,
                payment_id: payment?.id,
                status: paymentMethod.includes("manual") ? "active" : "pending",
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

            saveProgress(3);
            nextStep(); // -> step 3 selesai
        } catch (err) {
            console.error("Payment error:", err);
            alert("Terjadi kesalahan saat memproses pembayaran");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
                {/* Stepper */}
                <div className="w-full max-w-3xl mb-12">
                    <div className="flex justify-between relative">
                        {steps.map((label, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${idx <= step
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "bg-gray-300 text-gray-600"
                                        }`}
                                >
                                    {idx + 1}
                                </div>
                                <span
                                    className={`mt-2 text-xs sm:text-sm ${idx === step ? "text-indigo-600 font-semibold" : "text-gray-500"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
                            <div
                                className="h-0.5 bg-indigo-600 transition-all duration-500"
                                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Registrasi */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-5"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">Registrasi Akun</h2>
                                <Input placeholder="Nama Lengkap" value={fullName} onChange={e => setFullName(e.target.value)} />
                                <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                {/* Password input dengan icon mata */}
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Validasi password */}
                                {password && (
                                    <ul className="text-xs text-gray-500 space-y-1">
                                        <li className={password.length >= 8 ? "text-green-600" : "text-red-500"}>
                                            • Minimal 8 karakter
                                        </li>
                                        <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            • Ada huruf besar
                                        </li>
                                        <li className={/[0-9]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            • Ada angka
                                        </li>
                                    </ul>
                                )}
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                                    <span className="text-sm text-gray-600">Saya menyetujui Terms & Conditions</span>
                                </div>
                                <Button className="w-full mt-4" onClick={handleSignup} disabled={loading}>
                                    {loading ? "Loading..." : "Daftar & Cek Email →"}
                                </Button>
                            </motion.div>
                        )}

                        {/* Step 1: Validasi */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-5 text-center"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">Validasi Akun</h2>
                                <p className="text-gray-500">
                                    Kami telah mengirim link konfirmasi ke:
                                    <br />
                                    <span className="font-semibold text-gray-800">{email}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Jika email salah, silakan kembali dan perbaiki.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                                    <Button variant="outline" onClick={() => prevStep()}>
                                        ← Kembali
                                    </Button>
                                    <Button onClick={handleValidate}>Saya Sudah Konfirmasi Email</Button>
                                </div>
                            </motion.div>
                        )}


                        {/* Step 2: Payment */}
                        {step === 2 && plan && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-5"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">Pembayaran</h2>

                                {activePaymentMethod === "manual" && (
                                    <>
                                        {/* QRIS */}
                                        {paymentConfig.QRIS && (
                                            <div className="border rounded-lg">
                                                <button
                                                    className="w-full text-left px-4 py-2 font-medium"
                                                    onClick={() => setShowQRIS(!showQRIS)}
                                                >
                                                    QRIS
                                                </button>
                                                {showQRIS && (
                                                    <div className="p-4">
                                                        <img
                                                            src={paymentConfig.QRIS}
                                                            alt="QRIS"
                                                            className="w-40 mx-auto"
                                                        />
                                                        <button
                                                            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded w-full"
                                                            onClick={() => setPaymentMethod("manual_qris")}
                                                        >
                                                            Pilih QRIS
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Upload bukti transfer */}
                                        <input
                                            type="file"
                                            className="w-full border rounded p-2"
                                            onChange={(e) =>
                                                setProof(e.target.files ? e.target.files[0] : null)
                                            }
                                        />
                                    </>
                                )}

                                {activePaymentMethod === "gateway" && (
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold">Payment Gateway</h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Metode pembayaran otomatis melalui Midtrans
                                        </p>
                                        <button
                                            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);

                                                    const res = await fetch("/api/midtrans/checkout", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            userId,
                                                            amount: plan.price,
                                                            items: [
                                                                {
                                                                    id: plan.id,
                                                                    price: plan.price,
                                                                    quantity: 1,
                                                                    name: plan.name,
                                                                },
                                                            ],
                                                        }),
                                                    });

                                                    const data = await res.json();

                                                    if (data?.redirect_url) {
                                                        window.location.href = data.redirect_url; // langsung redirect ke Snap
                                                    } else {
                                                        alert("Gagal memproses pembayaran");
                                                    }
                                                } catch (err) {
                                                    console.error("Midtrans checkout error:", err);
                                                    alert("Terjadi kesalahan saat membuat transaksi");
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        >
                                            Bayar dengan Gateway
                                        </button>
                                    </div>
                                )}


                                {!activePaymentMethod && (
                                    <p className="text-gray-500 text-sm">
                                        Tidak ada metode pembayaran yang aktif. Hubungi admin.
                                    </p>
                                )}

                                <Button className="w-full mt-4" onClick={handlePayment} disabled={loading}>
                                    {loading ? "Processing..." : "Konfirmasi & Bayar →"}
                                </Button>
                            </motion.div>
                        )}


                        {/* Step 3: Selesai */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-5 text-center"
                            >
                                <h2 className="text-2xl font-bold text-green-600">🎉 Selesai!</h2>
                                <p className="text-gray-600">
                                    Akun Anda aktif & pembayaran berhasil. Silakan login ke dashboard.
                                </p>
                                <Button onClick={() => router.push("/dashboard-user")}>
                                    Login ke Dashboard
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
