"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

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
}

interface ModalBillingPlanProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BillingPlan) => void;
    initialData?: BillingPlan | null;
    packageId: string;
}

export default function ModalBillingPlan({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    packageId,
}: ModalBillingPlanProps) {
    const [name, setName] = useState("");
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [price, setPrice] = useState(0);
    const [tokenLimit, setTokenLimit] = useState(0);
    const [durationDays, setDurationDays] = useState(30);
    const [isActive, setIsActive] = useState(true);
    const [features, setFeatures] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setBillingCycle(initialData.billing_cycle || "monthly");
            setPrice(initialData.price ?? 0);
            setTokenLimit(initialData.token_limit ?? 0);
            setDurationDays(initialData.duration_days ?? 30);
            setIsActive(initialData.is_active ?? true);
            setFeatures(initialData.features || []);
        } else {
            setName("");
            setBillingCycle("monthly");
            setPrice(0);
            setTokenLimit(0);
            setDurationDays(30);
            setIsActive(true);
            setFeatures([]);
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!name.trim()) {
            alert("Nama billing plan wajib diisi");
            return;
        }
        onSubmit({
            id: initialData?.id,
            package_id: packageId,
            name,
            billing_cycle: billingCycle,
            price,
            token_limit: tokenLimit,
            duration_days: durationDays,
            is_active: isActive,
            features,
        });
        onClose();
    };

    const addFeature = () => setFeatures([...features, ""]);
    const updateFeature = (idx: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[idx] = value;
        setFeatures(newFeatures);
    };
    const removeFeature = (idx: number) =>
        setFeatures(features.filter((_, i) => i !== idx));

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            {initialData ? "Edit Billing Plan" : "Tambah Billing Plan"}
          </h2>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1 dark:text-gray-200">Nama Plan</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
      
              <div className="space-y-3">
                <label className="block text-sm mb-1 dark:text-gray-200">Billing Cycle</label>
                <select
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                >
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
      
              <div>
                <label className="block text-sm mb-1 dark:text-gray-200">Harga</label>
                <input
                  type="number"
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
      
              <div>
                <label className="block text-sm mb-1 dark:text-gray-200">Token Limit</label>
                <input
                  type="number"
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={tokenLimit}
                  onChange={(e) => setTokenLimit(Number(e.target.value))}
                />
              </div>
      
              <div>
                <label className="block text-sm mb-1 dark:text-gray-200">Durasi (hari)</label>
                <input
                  type="number"
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                />
              </div>
            </div>
      
            {/* Right Side */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1 dark:text-gray-200">Aktif?</label>
                <select
                  className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={isActive ? "1" : "0"}
                  onChange={(e) => setIsActive(e.target.value === "1")}
                >
                  <option value="1">Ya</option>
                  <option value="0">Tidak</option>
                </select>
              </div>
      
              <div>
                <label className="block text-sm mb-2 dark:text-gray-200">Fitur</label>
                <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-2 dark:bg-gray-800">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex items-center mb-2 gap-2">
                      <input
                        type="text"
                        className="flex-1 rounded border border-gray-300 dark:border-gray-700 p-1 dark:bg-gray-900 dark:text-gray-200"
                        value={f}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="text-red-600 hover:underline dark:text-red-400"
                        onClick={() => removeFeature(idx)}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline mt-1 dark:text-blue-400"
                    onClick={addFeature}
                  >
                    + Tambah Fitur
                  </button>
                </div>
              </div>
            </div>
          </div>
      
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Simpan
            </button>
          </div>
        </Modal>
      );
      
}
