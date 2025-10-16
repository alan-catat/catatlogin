"use client";

import { useEffect, useState } from "react";

interface Role {
    id: string;
    email: string;
    user_id: string;
    role: string;
}

export default function RolesManager({ supabase }: { supabase: any }) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [newUserId, setNewUserId] = useState("");
    const [loading, setLoading] = useState(false);

    // load data awal
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const { data, error } = await supabase.from("super_admins").select("*");
        if (error) console.error(error);
        else setRoles(data || []);
    };

    const addRole = async () => {
        if (!newUserId) return alert("User ID wajib diisi");
        setLoading(true);
        const { error } = await supabase
            .from("super_admins")
            .insert([{ user_id: newUserId, role: "super_admin" }]);
        setLoading(false);
        if (error) {
            console.error(error);
            alert("Gagal tambah admin");
        } else {
            setNewUserId("");
            fetchRoles();
        }
    };

    const deleteRole = async (id: string) => {
        if (!confirm("Yakin hapus admin ini?")) return;
        setLoading(true);
        const { error } = await supabase
            .from("super_admins")
            .delete()
            .eq("id", id);
        setLoading(false);
        if (error) {
            console.error(error);
            alert("Gagal hapus admin");
        } else {
            fetchRoles();
        }
    };

    return (
        <div className="space-y-6">
            {/* Input + Button */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="User ID"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm 
                         focus:ring-2 focus:ring-indigo-500
                         dark:bg-white/[0.05] dark:border-gray-600 dark:text-white"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                />
                <button
                    onClick={addRole}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg 
                         text-sm font-medium shadow hover:bg-green-700
                         disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-50 dark:bg-white/[0.08]">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                Email
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                Role
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No admin found
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors
             dark:border-gray-700 dark:hover:bg-white/[0.03]"
                                >
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{role.email}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{role.role}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => deleteRole(role.id)}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700
                 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
