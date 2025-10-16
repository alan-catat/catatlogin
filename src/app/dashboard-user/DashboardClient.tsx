'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAlert } from "@/components/ui/alert/Alert"

import { StatCard } from "@/components/dashboard/StatCard"
import { PieCart } from "@/components/charts/pie/PieCart"
import { Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign } from "lucide-react"
import { exportToExcel } from "@/utils/exportExcel" // fungsi yang sudah ada
import { USER_OVERVIEWS } from "@/config/variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Category {
  id: string;
  name: string;
}

interface CashFlow {
  id: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  created_at: string;
  user_id: string;
  category: Category;
}



export default function DashboardUser() {
  const supabase = createClient()
  const { setAlertData } = useAlert()

  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [periods, setPeriods] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")

  const [cashFlows, setCashFlows] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  const colors = ["text-blue-500", "text-green-500", "text-purple-500", "text-orange-500", "text-pink-500"]
  const icons = [Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign]


  // === Fetch Groups ===
  async function fetchGroups(supabase: any, userId: string) {
    const { data, error } = await supabase
      .from("chat")
      .select("id, name")
      .eq("user_id", userId)

    if (error) {
      console.error("Supabase error:", error.message)
      return []
    }

    return data || []
  }

  // === Generate Periods ===
  function generatePeriods() {
    const now = new Date()
    const periods: string[] = []

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = d.toLocaleString("en-US", { month: "long" })
      const year = d.getFullYear()
      periods.push(`${month} ${year}`)
    }
    return periods.reverse()
  }

  // === Ambil data cash flow user ===
  async function fetchUserCashFlows(supabase: any, userId: string) {
    const { data, error } = await supabase
      .from("cash_flows")
      .select("id, user_id, flow_type, flow_amount, created_at, category:category_id(id, name)")
      .eq("user_id", userId)
    if (error) {
      console.error("Supabase error:", error.message)
      return []
    }

    return data
  }

  function groupByCategory(data: CashFlow[], type: "income" | "expense") {
    const grouped: Record<string, number> = {}
    data.filter((d) => d.flow_type === type).forEach((row) => {
      const cat = row.category?.name || "Other"
      grouped[cat] = (grouped[cat] || 0) + Math.abs(row.flow_amount)
    })
    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }


  useEffect(() => {
    const init = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoggedIn(false)
        setLoading(false)
        return
      }
      setUser(user)

      const cashFlows: CashFlow[] = await fetchUserCashFlows(supabase, user.id)
      setCashFlows(cashFlows)
      const totalIncome = cashFlows.filter(f => f.flow_type === "income").reduce((a, b) => a + Math.abs(b.flow_amount), 0)
      const totalExpense = cashFlows.filter(f => f.flow_type === "expense").reduce((a, b) => a + Math.abs(b.flow_amount), 0)
      const balance = totalIncome - totalExpense

      const incomeData = groupByCategory(cashFlows, "income")
      const expenseData = groupByCategory(cashFlows, "expense")

      setStats({
        balance,
        totalIncome,
        totalExpense,
        entries: cashFlows.length,
        incomeData,
        expenseData,
      })

      // ambil daftar group
      const userGroups = await fetchGroups(supabase, user.id)
      setGroups(userGroups)

      // buat daftar periode
      const p = generatePeriods()
      setPeriods(p)
      setSelectedPeriod(p[p.length - 1]) // default = periode terbaru

      setLoading(false)
    }

    init()
  }, [supabase])

  // === Handler Export ===
  // === Handler Export ===
  const handleExport = async () => {
    if (!user) {
      alert("Anda belum login")
      return
    }

    const flows = await fetchFilteredCashFlows(supabase, user.id, selectedGroup, selectedPeriod)

    if (!flows.length) {
      alert("Tidak ada data cashflow untuk diexport")
      return
    }

    exportToExcel(flows, { fileName: "cashflows.xlsx", userId: user.id })
  }


  // === Ambil cash flow sesuai filter ===
  async function fetchFilteredCashFlows(supabase: any, userId: string, groupId: string, period: string) {
    let query = supabase
      .from("cash_flows")
      .select("id, flow_type, flow_amount, created_at, chat_channel_id, category:category_id(id, name)")
      .eq("user_id", userId)

    // filter group
    if (groupId) {
      query = query.eq("chat_channel_id", groupId)
    }

    // filter periode (format: "August 2025")
    if (period) {
      const [monthName, yearStr] = period.split(" ")
      const month = new Date(`${monthName} 1, ${yearStr}`).getMonth() + 1
      const year = parseInt(yearStr)

      const start = new Date(year, month - 1, 1).toISOString()
      const end = new Date(year, month, 0, 23, 59, 59).toISOString()

      query = query.gte("created_at", start).lte("created_at", end)
    }

    const { data, error } = await query
    if (error) {
      console.error("Supabase error:", error.message)
      return []
    }
    return data
  }

  // === Hitung statistik & growth dibanding bulan lalu ===
  async function calculateStats(supabase: any, userId: string, groupId: string, period: string) {
    const flows = await fetchFilteredCashFlows(supabase, userId, groupId, period)

    const totalIncome = flows.filter((f: { flow_type: string }) => f.flow_type === "income").reduce((a: any, b: { flow_amount: any }) => a + Math.abs(b.flow_amount), 0)
    const totalExpense = flows.filter((f: { flow_type: string }) => f.flow_type === "expense").reduce((a: any, b: { flow_amount: any }) => a + Math.abs(b.flow_amount), 0)
    const balance = totalIncome - totalExpense

    const incomeData = groupByCategory(flows, "income")
    const expenseData = groupByCategory(flows, "expense")

    // === Hitung bulan sebelumnya ===
    let prevIncome = 0, prevExpense = 0, prevBalance = 0, prevEntries = 0
    if (period) {
      const [monthName, yearStr] = period.split(" ")
      const currMonth = new Date(`${monthName} 1, ${yearStr}`).getMonth()
      const currYear = parseInt(yearStr)
      const prevDate = new Date(currYear, currMonth - 1, 1)
      const prevPeriod = prevDate.toLocaleString("en-US", { month: "long" }) + " " + prevDate.getFullYear()

      const prevFlows = await fetchFilteredCashFlows(supabase, userId, groupId, prevPeriod)
      prevIncome = prevFlows.filter((f: { flow_type: string }) => f.flow_type === "income").reduce((a: any, b: { flow_amount: any }) => a + Math.abs(b.flow_amount), 0)
      prevExpense = prevFlows.filter((f: { flow_type: string }) => f.flow_type === "expense").reduce((a: any, b: { flow_amount: any }) => a + Math.abs(b.flow_amount), 0)
      prevBalance = prevIncome - prevExpense
      prevEntries = prevFlows.length
    }

    function growth(curr: number, prev: number) {
      if (prev === 0) return curr > 0 ? 100 : 0
      return ((curr - prev) / prev * 100).toFixed(1)
    }

    return {
      balance, totalIncome, totalExpense, entries: flows.length,
      incomeData, expenseData,
      changes: {
        balance: growth(balance, prevBalance),
        income: growth(totalIncome, prevIncome),
        expense: growth(totalExpense, prevExpense),
        entries: growth(flows.length, prevEntries),
      }
    }
  }


  // ini yang ngurus stats (periode / group berubah -> hitung ulang)
  useEffect(() => {
    if (!user || !selectedPeriod) return
    const refresh = async () => {
      const flows = await fetchFilteredCashFlows(supabase, user.id, selectedGroup, selectedPeriod)
      setCashFlows(flows) // <--- simpan hasil filter
      const newStats = await calculateStats(supabase, user.id, selectedGroup, selectedPeriod)
      setStats(newStats)
    }
    refresh()
  }, [selectedGroup, selectedPeriod, user])

  if (loading) {
    return <div className="text-center mt-10">Memuat dashboard...</div>
  }

  if (!loggedIn) {
    return (
      <div className="text-center text-red-500 mt-10">
        Anda belum login atau sesi sudah berakhir.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left side: filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Group Select */}
          <select
            className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <DatePicker
            selected={
              selectedPeriod
                ? new Date(
                  `${selectedPeriod.split(" ")[0]} 1, ${selectedPeriod.split(" ")[1]}`
                )
                : null
            }
            onChange={(date) => {
              if (!date) return
              const month = date.toLocaleString("en-US", { month: "long" })
              const year = date.getFullYear()
              setSelectedPeriod(`${month} ${year}`)
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            includeDates={periods.map(
              (p) => new Date(`${p.split(" ")[0]} 1, ${p.split(" ")[1]}`)
            )}
            className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto"
          />


        </div>

        {/* Right side: export */}
        <button
          onClick={handleExport}
          className="
            flex items-center justify-center gap-2 
            border rounded-lg px-4 py-2 w-full sm:w-auto
            bg-white text-gray-800
            hover:bg-gray-100
            dark:bg-gray-800 dark:text-gray-200
            dark:hover:bg-gray-700
            transition-colors duration-200
          "
        >
          Export
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={USER_OVERVIEWS.totalBalance.title}
          value={`$${stats.balance}`}
          change={`${stats.changes?.balance}%`}
          compare={USER_OVERVIEWS.totalBalance.compare}
        />
        <StatCard
          title={USER_OVERVIEWS.totalIncome.title}
          value={`$${stats.totalIncome}`}
          change={`${stats.changes?.income}%`}
          compare={USER_OVERVIEWS.totalIncome.compare}
        />
        <StatCard
          title={USER_OVERVIEWS.totalExpense.title}
          value={`$${stats.totalExpense}`}
          change={`${stats.changes?.expense}%`}
          compare={USER_OVERVIEWS.totalExpense.compare}
        />
        <StatCard
          title={USER_OVERVIEWS.entries.title}
          value={stats.entries}
          change={`${stats.changes?.entries}%`}
          compare={USER_OVERVIEWS.entries.compare}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieCart
          title={USER_OVERVIEWS.incomeChartBreakdown.title}
          data={stats.incomeData}
          total={stats.totalIncome}
        />
        <PieCart
          title={USER_OVERVIEWS.expenseChartBreakdown.title}
          data={stats.expenseData}
          total={stats.totalExpense}
        />
      </div>


      {/* Category Lists */}

      {/* Category Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Category */}
        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 dark:bg-white/5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-400">
            {USER_OVERVIEWS.incomeChart.title}
          </h2>
          <div className="space-y-3">
            {stats.incomeData?.map((item: any, idx: number) => {
              const Icon = icons[idx % icons.length];
              const color = colors[idx % colors.length];
              return (
                <div key={item.name} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Category */}
        <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 dark:bg-white/5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-400">
            {USER_OVERVIEWS.expenseChart.title}
          </h2>
          <div className="space-y-3">
            {stats.expenseData?.map((item: any, idx: number) => {
              const Icon = icons[idx % icons.length];
              const color = colors[idx % colors.length];
              return (
                <div key={item.name} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );

}
