"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { exportToExcel } from "@/utils/exportExcel";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";


interface UserRow {
    user_id: string;
    full_name: string;
    email: string;
    user_status: string;
    last_login: string | null;
    subscription_tier: string | null;
    start_date: string | null;
    end_date: string | null;
    payment_status: string | null;
    amount_paid: number | null;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    // State
    const [openHeaderDropdown, setOpenHeaderDropdown] = useState(false);

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (user_id: string) => {
        setOpenDropdown(openDropdown === user_id ? null : user_id);
    };

    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const toggleExpand = (userId: string) => {
        setExpandedRow(expandedRow === userId ? null : userId);
    };

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);

    const openProfileModal = async (userId: string) => {
        console.log(userId);
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return;
        }

        setSelectedProfile(data);
        setIsProfileModalOpen(true);
    };

    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
        setSelectedProfile(null);
    };


    // 🔹 state untuk filter & pagination
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [filterModal, setFilterModal] = useState(false);

    // filter state
    const [sortBy, setSortBy] = useState("Default");
    const [statusFilter, setStatusFilter] = useState("All");

    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, [search, activeTab, page, pageSize, sortBy, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        const columnMap: Record<string, string> = {
            "Default": "last_login",   // pakai last_login, bukan updated_at
            "Full Name": "full_name",
            "Due Date": "end_date",     // dari user_subscriptions
            "Last Login": "last_login"
        };

        // Ambil kolom sort berdasarkan pilihan user
        const sortColumn = columnMap[sortBy] || "last_login";

        const { data, error } = await supabase.rpc("get_user_management_data", {
            search_query: search,
            filter_status: activeTab !== "All" ? activeTab.toLowerCase() : null,
            sort_column: sortColumn,
            sort_order: "DESC", // bisa ubah jadi "ASC" jika perlu
            limit_count: pageSize,
            offset_count: (page - 1) * pageSize,
        });




        if (error) {
            console.error("Gagal mengambil data users:", error.message);
            setUsers([]);
        } else {
            setUsers(data || []);
        }

        setLoading(false);
    };
    // cek apakah semua user di halaman ini sudah dipilih
    const allChecked = users.length > 0 && selectedUsers.length === users.length;

    const toggleSelectAll = () => {
        if (allChecked) {
            setSelectedUsers([]); // uncheck semua
        } else {
            setSelectedUsers(users.map((_, idx) => idx.toString())); // pilih semua (pakai index atau id unik kalau ada)
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const updateUserStatus = async (userIds: string[], status: string) => {
        const { error } = await supabase
            .from("user_profiles")
            .update({ user_status: status })
            .in("user_id", userIds)
            .is("deleted_at", null);

        if (error) {
            console.error("Error updating status:", error.message);
        } else {
            fetchUsers(); // refresh tabel
        }
    };

    const softDeleteUsers = async (userIds: string[]) => {
        // Timestamp sekarang
        const deletedAt = new Date().toISOString();

        // Update user_profiles: set deleted_at dan user_status = 'Inactive'
        const { error: userError } = await supabase
            .from("user_profiles")
            .update({ deleted_at: deletedAt, user_status: "Inactive" })
            .in("user_id", userIds);

        if (userError) {
            console.error("Error updating user_profiles:", userError.message);
            return;
        }

        // Update user_subscriptions: set status = 'inactive' untuk semua subscription terkait
        const { error: subsError } = await supabase
            .from("user_subscriptions")
            .update({ status: "inactive" })
            .in("user_id", userIds);

        if (subsError) {
            console.error("Error updating user_subscriptions:", subsError.message);
            return;
        }

        // Refresh data tabel
        fetchUsers();
    };



    return (
        <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                    USER MANAGEMENT
                </h1>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Total payable amount:{" "}
                        <span className="font-semibold text-indigo-600">
                            $
                            {users.reduce((sum, u) => sum + (u.amount_paid || 0), 0).toFixed(
                                2
                            )}{" "}
                            USD
                        </span>
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                {["All", "Paid", "Unpaid", "Expired", "Trial"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)} // 🔹 set activeTab
                        className={`pb-2 text-sm font-medium ${activeTab === tab
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "border-b-2 border-transparent text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:border-indigo-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}

            </div>

            {/* Toolbar Search */}
            <div className="flex items-center justify-between mb-4">

                {/* Popup Filter */}
                <div className="relative inline-block">
                    {/* Tombol trigger */}
                    <button
                        onClick={() => setFilterModal(!filterModal)}
                        className="px-3 py-2 bg-gray-600 text-white rounded"
                    >
                        Filter
                    </button>

                    {filterModal && (
                        <div className="absolute left-full top-0 ml-2 w-80 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg z-50">
                            <h2 className="text-lg font-semibold mb-4">Filter & Sort</h2>

                            {/* Sort By */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <div className="space-y-2">
                                    {["Default", "Full Name", "Last Login", "Due Date"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === opt}
                                                onChange={() => setSortBy(opt)}
                                                className="rounded"
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                            {/* Status */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <div className="space-y-2">
                                    {["All", "active", "inactive"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={statusFilter === opt}
                                                onChange={() => setStatusFilter(opt)}
                                                className="rounded"
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <input
                    type="text"
                    placeholder="Search Users by Name, Email or Date"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-80 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-white/[0.05] dark:border-gray-600 dark:text-white"
                />

                <button
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700"
                    onClick={() => exportToExcel(users, { fileName: "user-subscriptions.xlsx", sheetName: "User Subscriptions" })}
                >
                    Export
                </button>

            </div>


            {/* Table */}
            <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-white/[0.08]">
                        <tr>
                            <th className="p-3">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-3 font-medium text-gray-600 dark:text-gray-300">
                                Name
                            </th>
                            <th className="p-3 font-medium text-gray-600 dark:text-gray-300">
                                User Status
                            </th>
                            <th className="p-3 font-medium text-gray-600 dark:text-gray-300">
                                Subs Status
                            </th>
                            <th className="p-3 font-medium text-gray-600 dark:text-gray-300">
                                Payment Status
                            </th>
                            <th className="p-3 font-medium text-gray-600 dark:text-gray-300">
                                Amount
                            </th>
                            <th className="p-3">
                                <div className="flex items-center gap-2">
                                    {/* Hanya tampilkan tombol titik tiga kalau ada lebih dari 1 yang dipilih */}
                                    {selectedUsers.length > 1 && (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenHeaderDropdown((prev) => !prev);
                                                }}
                                                className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                            >
                                                <span className="text-lg">⋮</span>
                                            </button>

                                            {openHeaderDropdown && (
                                                <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                                                    <button
                                                        onClick={() => updateUserStatus(selectedUsers, "Active")}
                                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Activate
                                                    </button>
                                                    <button
                                                        onClick={() => updateUserStatus(selectedUsers, "Inactive")}
                                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Deactivate
                                                    </button>
                                                    <button
                                                        onClick={() => softDeleteUsers(selectedUsers)}
                                                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-4 text-center">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            users.map((u, i) => (
                                <React.Fragment key={i}>
                                    <tr className="border-t hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]">
                                        <td className="p-3 flex items-center gap-2">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(i.toString())}
                                                onChange={() => toggleSelectOne(i.toString())}
                                            />

                                            {/* Expand Button pakai user_id */}
                                            <button
                                                onClick={() => toggleExpand(u.user_id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                {expandedRow === u.user_id ? "▲" : "▼"}
                                            </button>
                                        </td>

                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {u.full_name}
                                                </p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${u.user_status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : u.user_status === "Dormant"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : u.user_status === "Inactive"
                                                                ? "bg-gray-200 text-gray-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {u.user_status}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Last login:{" "}
                                                    {u.last_login
                                                        ? new Date(u.last_login).toLocaleDateString()
                                                        : "-"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                                                {u.subscription_tier || "Free"}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${u.payment_status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : u.payment_status === "Unpaid"
                                                        ? "bg-red-100 text-red-700"
                                                        : u.payment_status === "Expired"
                                                            ? "bg-gray-200 text-gray-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {u.payment_status}
                                            </span>
                                        </td>
                                        <td className="p-3 font-medium text-gray-800 dark:text-white">
                                            {u.amount_paid ? `$${u.amount_paid} USD` : "-"}
                                        </td>
                                        <td className="p-3 relative">
                                            {/* Tombol trigger */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown((prev) =>
                                                        prev === u.user_id ? null : u.user_id
                                                    );
                                                }}
                                                className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                            >
                                                <span className="text-sm">View More</span>
                                                <span className="text-lg">⋮</span>
                                            </button>

                                            {/* Dropdown */}
                                            {openDropdown === (u.user_id || "none") && (
                                                <div className="absolute right-full top-0 mr-2 w-48 bg-white border rounded shadow-lg z-50">
                                                    <button
                                                        onClick={() => openProfileModal(u.user_id)}
                                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => updateUserStatus([u.user_id], "Active")}
                                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Activate
                                                    </button>
                                                    <button
                                                        onClick={() => updateUserStatus([u.user_id], "Inactive")}
                                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Deactivate
                                                    </button>
                                                    <button
                                                        onClick={() => softDeleteUsers([u.user_id])}
                                                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    {expandedRow === u.user_id && (
                                        <tr className="bg-gray-50 dark:bg-white/[0.05]">
                                            <td colSpan={7} className="p-4">
                                                <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded">
                                                    <thead className="bg-gray-100 dark:bg-white/[0.1]">
                                                        <tr>
                                                            <th className="p-2 text-left text-gray-700 dark:text-gray-200">Start Date</th>
                                                            <th className="p-2 text-left text-gray-700 dark:text-gray-200">End Date</th>
                                                            <th className="p-2 text-left text-gray-700 dark:text-gray-200">Package</th>
                                                            <th className="p-2 text-left text-gray-700 dark:text-gray-200">Payment</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="border-t border-gray-200 dark:border-gray-700">
                                                            <td className="p-2 text-gray-800 dark:text-gray-300">{u.start_date || "-"}</td>
                                                            <td className="p-2 text-gray-800 dark:text-gray-300">{u.end_date || "-"}</td>
                                                            <td className="p-2 text-gray-800 dark:text-gray-300">{u.subscription_tier || "Free"}</td>
                                                            <td className="p-2 text-gray-800 dark:text-gray-300">
                                                                {u.payment_status
                                                                    ? `${u.payment_status} (${u.amount_paid || 0} USD)`
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            {isProfileModalOpen && selectedProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={closeProfileModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                            Profile
                        </h3>

                        {/* Body */}
                        <div className="space-y-10">
                            <div className="space-y-6 border-b border-gray-200 pb-6 last:border-none last:pb-0 dark:border-gray-800">
                                <UserMetaCard profile={selectedProfile} />
                                <UserInfoCard profile={selectedProfile} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded px-2 py-1"
                    >
                        {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
