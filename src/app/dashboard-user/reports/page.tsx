'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import DatePicker from "@/components/form/date-picker"
import { Modal } from "@/components/ui/modal"
import { exportToExcel } from "@/utils/exportExcel"

export default function ReportPage() {
  const supabase = createClient()
  const [reports, setReports] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [showAddModal, setShowAddModal] = useState(false)

  // State sementara untuk input
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");

  // Tombol Apply
  const handleApplyDates = () => {
    setDateFrom(tempDateFrom)
    setDateTo(tempDateTo)
    fetchReports()
  }

  // === Ambil group list (table chat) ===
  useEffect(() => {
    const fetchGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from("chat")
        .select("id, name")
        .eq("user_id", user.id)

      if (!error && data) setGroups(data)
    }
    fetchGroups()
  }, [])

  // === Ambil laporan (cash_flows + categories) ===
  const fetchReports = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from("cash_flows")
      .select(`
        id,
        flow_transaction_date,
        flow_type,
        flow_merchant,
        flow_items,
        flow_amount,
        cash_flows_category_id_fkey ( name )
      `)
      .eq("user_id", user.id)

    if (selectedGroup) {
      query = query.eq("group_id", selectedGroup)
    }
    if (dateFrom && dateTo) {
      query = query.gte("flow_transaction_date", dateFrom).lte("flow_transaction_date", dateTo)
    }

    const { data, error } = await query.order("flow_transaction_date", { ascending: false })

    if (!error && data) {
      setReports(
        data.map((r) => ({
          date: r.flow_transaction_date,
          type: r.flow_type,
          category: r.cash_flows_category_id_fkey?.[0]?.name || "-",
          merchant: r.flow_merchant,
          item: r.flow_items,
          amount: r.flow_amount,
        }))
      )
    }
  }

  useEffect(() => {
    fetchReports()
  }, [selectedGroup, dateFrom, dateTo])

  const handleExport = () => {
    if (!reports.length) {
      alert("Tidak ada data untuk diexport")
      return
    }

    const rows = reports.map(r => ({
      Date: r.date,
      Type: r.type,
      Category: r.category,
      Merchant: r.merchant,
      Item: r.item,
      Amount: r.amount,
    }))

    exportToExcel(rows, { fileName: "reports.xlsx" })
  }



  return (
    <div className="p-6 space-y-6">
      {/* === Filter Bar === */}
      {/* === Filter Bar === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <select
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            {/* Start Date */}
            <input
              type="date"
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              value={tempDateFrom}
              onChange={(e) => setTempDateFrom(e.target.value)}
            />

            {/* End Date */}
            <input
              type="date"
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              value={tempDateTo}
              onChange={(e) => setTempDateTo(e.target.value)}
            />

            {/* Apply Button */}
            <button
              onClick={() => {
                setDateFrom(tempDateFrom);
                setDateTo(tempDateTo);
                fetchReports(); // panggil fungsi filter
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      {/* === Report Table === */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[600px] w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Merchant</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.merchant}</td>
                  <td className="px-4 py-3">{row.item}</td>
                  <td
                    className={`px-4 py-3 font-medium ${row.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {row.amount > 0
                      ? `+$${row.amount.toFixed(2)}`
                      : `-$${Math.abs(row.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Report</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault(); // cegah reload halaman

                // ambil value dari input
                const flow_transaction_date = (e.currentTarget.querySelector<HTMLInputElement>('input[type="date"]')?.value || "").trim();
                const flow_type = (e.currentTarget.querySelector<HTMLSelectElement>('select')?.value || "").trim();
                const category = (e.currentTarget.querySelector<HTMLInputElement>('input[placeholder="Category"]')?.value || "").trim();
                const merchant = (e.currentTarget.querySelector<HTMLInputElement>('input[placeholder="Merchant"]')?.value || "").trim();
                const item = (e.currentTarget.querySelector<HTMLInputElement>('input[placeholder="Item"]')?.value || "").trim();
                const amount = parseFloat(e.currentTarget.querySelector<HTMLInputElement>('input[placeholder="Amount"]')?.value || "0");

                if (!flow_transaction_date || !flow_type || !category || !merchant || !item || !amount) {
                  alert("Please fill all fields");
                  return;
                }

                // simpan ke Supabase
                const { data, error } = await supabase
                  .from("cash_flows")
                  .insert([{ flow_transaction_date, flow_type, flow_merchant: merchant, flow_items: item, flow_amount: amount, category_id: category }]);

                if (error) {
                  console.error("Error saving data:", error);
                  alert("Failed to save data");
                  return;
                }

                alert("Data saved successfully");
                setShowAddModal(false);
                // optional: refresh table / state
              }}
            >

              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                placeholder="Flow Date"
              />
              <select className="border rounded-lg px-3 py-2">
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="text"
                className="border rounded-lg px-3 py-2"
                placeholder="Category"
              />
              <input
                type="text"
                className="border rounded-lg px-3 py-2"
                placeholder="Merchant"
              />
              <input
                type="text"
                className="border rounded-lg px-3 py-2"
                placeholder="Item"
              />
              <input
                type="number"
                className="border rounded-lg px-3 py-2"
                placeholder="Amount"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
