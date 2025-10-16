"use client";

import { useState } from "react";

export default function UserTable() {
  const [openModal, setOpenModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const users = [
    { id: 1, name: "Alice", email: "alice@mail.com" },
    { id: 2, name: "Bob", email: "bob@mail.com" },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="relative p-4">
      {/* Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 space-x-2 relative">

                {/* Dropdown Menu */}
                {openDropdown === u.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                      View
                    </button>
                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                      Edit
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
                {/* Modal Button */}
                <button
                  onClick={() => setOpenModal(true)}
                  className="px-2 py-1 bg-indigo-600 text-white rounded"
                >
                  Modal
                </button>

                {/* Dropdown Button */}
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === u.id ? null : u.id)
                  }
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  Dropdown
                </button>

                {/* Toast Button */}
                <button
                  onClick={() => showToast(`Hello ${u.name}!`)}
                  className="px-2 py-1 bg-yellow-600 text-white rounded"
                >
                  Toast
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Modal Content</h2>
            <p className="text-sm text-gray-600">
              Ini contoh modal sederhana.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setOpenModal(false)}
                className="px-3 py-1 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
