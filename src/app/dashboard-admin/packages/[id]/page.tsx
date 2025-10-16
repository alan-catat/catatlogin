"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MoreVertical } from "lucide-react";
import ModalBillingPlan from "../ModalBillingPlan";

interface Package {
    id: string;
    name: string | null;
    is_paid: boolean | null;
    price: number | null;
    token_limit: number | null;
    included_channels: string[] | null;
    created_at: string | null;
}

interface BillingPlan {
    id?: string;
    package_id: string;
    name: string;
    billing_cycle: string;
    price: number;
    token_limit: number;
    duration_days: number;
    is_active: boolean;
    features: string[];
    duration_months?: number; // optional untuk mapping ke db
}

export default function PackageDetailPage() {
    const params = useParams();
    const supabase = createClient();
    const [pkg, setPkg] = useState<Package | null>(null);
    const [plans, setPlans] = useState<BillingPlan[]>([]);
    const [loading, setLoading] = useState(true);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<BillingPlan | null>(null);

    useEffect(() => {
        if (params?.id) fetchData(params.id as string);
    }, [params]);

    const fetchData = async (id: string) => {
        setLoading(true);

        const { data: packageData } = await supabase
            .from("packages")
            .select("*")
            .eq("id", id)
            .single();

        const { data: planData } = await supabase
            .from("billing_plans")
            .select("*")
            .eq("package_id", id)
            .order("created_at", { ascending: false });

        setPkg(packageData);
        setPlans(
            (planData || []).map((p: any) => ({
                ...p,
                duration_days: (p.duration_months || 1) * 30,
                name: p.name || "",
                billing_cycle: p.billing_cycle || "monthly",
                token_limit: p.token_limit || 0,
                is_active: p.is_active ?? true,
                features: p.features || [],
            }))
        );
        setLoading(false);
    };

    const handleAdd = () => {
        setEditData(null);
        setShowModal(true);
    };

    const handleSubmitPlan = async (data: BillingPlan) => {
        console.log(data)
        if (!pkg) return;

        const insertData = {
            ...data
        };

        if (editData) {
            await supabase
                .from("billing_plans")
                .update(insertData)
                .eq("id", editData.id);
        } else {
            await supabase.from("billing_plans").insert(insertData);
        }

        fetchData(pkg.id);
        setShowModal(false);
    };

    const handleDelete = async (id: string) => {
        if (!pkg) return;
        if (confirm("Yakin ingin menghapus billing plan ini?")) {
            await supabase.from("billing_plans").delete().eq("id", id);
            fetchData(pkg.id);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!pkg) return <p>Package tidak ditemukan</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detail Package */}
            <div className="rounded-xl bg-white dark:bg-gray-900 shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Detail Package</h2>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-200">Nama</span>
                    <span>{pkg.name}</span>

                    <span className="font-semibold dark:text-gray-200">Jenis</span>
                    <span
                        className={
                            pkg.is_paid
                                ? "text-blue-600 font-medium dark:text-blue-400"
                                : "text-green-600 font-medium dark:text-green-400"
                        }
                    >
                        {pkg.is_paid
                            ? `Berbayar - Rp ${pkg.price?.toLocaleString()}`
                            : "Gratis"}
                    </span>

                    <span className="font-semibold dark:text-gray-200">Token Limit</span>
                    <span>{pkg.token_limit}</span>

                    <span className="font-semibold dark:text-gray-200">Channels</span>
                    <span>{pkg.included_channels?.join(", ") || "-"}</span>
                </div>
            </div>

            {/* Billing Plans */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow bg-white dark:bg-gray-900">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-gray-100">Billing Plans</h2>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Tambah Plan
                    </button>
                </div>

                <table className="w-full border border-gray-200 dark:border-gray-700 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        <tr>
                            <th className="border border-gray-200 dark:border-gray-700 px-2 py-1">Nama</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-2 py-1">Durasi</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-2 py-1">Harga</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-2 py-1">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr
                                key={plan.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 dark:text-gray-300">
                                    {plan.name}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 dark:text-gray-300">
                                    {Math.ceil(plan.duration_days / 30)} bulan
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 dark:text-gray-300">
                                    Rp {plan.price.toLocaleString()}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
                                    <div className="inline-flex items-center">
                                        <button
                                            onClick={() => {
                                                setEditData(plan);
                                                setShowModal(true);
                                            }}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                        >
                                            <MoreVertical className="w-4 h-4 dark:text-gray-300" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id!)}
                                            className="ml-2 text-red-600 hover:underline text-sm dark:text-red-400"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {plans.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-2 text-gray-500 dark:text-gray-400"
                                >
                                    Belum ada billing plan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Billing Plan */}
            <ModalBillingPlan
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmitPlan}
                initialData={editData || null}
                packageId={pkg.id}
            />
        </div>
    );

}
