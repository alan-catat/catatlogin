'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAlert } from "@/components/ui/alert/Alert"

import { StatCard } from "@/components/dashboard/StatCard"
import { PieCart } from "@/components/charts/pie/PieCart"
import { DASHBOARD_LABELS } from "@/config/variables"
import { LineChartCard } from "@/components/charts/line/LineChartOne"
import { PieChartCard } from "@/components/charts/PieChartCard"

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

export default function DashboardClient() {
  const supabase = createClient()
  const { setAlertData } = useAlert()

  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({})

  // === Helper functions ===
  function getWeekRange(date = new Date()) {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return { start, end }
  }

  async function fetchNewUsers(supabase: any) {
    const { start, end } = getWeekRange()
    const lastWeekStart = new Date(start)
    lastWeekStart.setDate(start.getDate() - 7)
    const lastWeekEnd = new Date(end)
    lastWeekEnd.setDate(end.getDate() - 7)

    const { count: thisWeek } = await supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString())

    const { count: lastWeek } = await supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastWeekStart.toISOString())
      .lt("created_at", lastWeekEnd.toISOString())

    let change = lastWeek > 0
      ? ((thisWeek! - lastWeek) / lastWeek) * 100
      : thisWeek > 0
        ? 100
        : 0


    return { value: thisWeek || 0, change }
  }

  async function fetchMonthlyActiveUsers(supabase: any) {
    const now = new Date()

    // thisMonth = 30 hari terakhir
    const thisMonthStart = new Date(now)
    thisMonthStart.setDate(now.getDate() - 30)

    // lastMonth = 30 hari sebelum periode thisMonth
    const lastMonthStart = new Date(thisMonthStart)
    lastMonthStart.setDate(thisMonthStart.getDate() - 30)
    const lastMonthEnd = new Date(thisMonthStart)

    const { data: thisMonthData } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", thisMonthStart.toISOString())
      .lt("created_at", now.toISOString())

    const { data: lastMonthData } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", lastMonthStart.toISOString())
      .lt("created_at", lastMonthEnd.toISOString())

    const uniqueThisMonth = new Set(thisMonthData?.map((x: { user_id: any }) => x.user_id)).size
    const uniqueLastMonth = new Set(lastMonthData?.map((x: { user_id: any }) => x.user_id)).size

    let change = uniqueLastMonth > 0
      ? ((uniqueThisMonth - uniqueLastMonth) / uniqueLastMonth) * 100
      : uniqueThisMonth > 0
        ? 100
        : 0

    return { value: uniqueThisMonth, change }
  }


  async function fetchDailyActiveUsers(supabase: any) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(todayStart.getDate() + 1)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(todayStart.getDate() - 1)

    const { data: today } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", tomorrowStart.toISOString())

    const { data: yesterday } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString())

    const uniqueToday = new Set(today?.map((x: { user_id: any }) => x.user_id)).size
    const uniqueYesterday = new Set(yesterday?.map((x: { user_id: any }) => x.user_id)).size

    let change = uniqueYesterday > 0
      ? ((uniqueToday! - uniqueYesterday) / uniqueYesterday) * 100
      : uniqueToday > 0
        ? 100
        : 0


    return { value: uniqueToday, change }
  }

  async function fetchTodayTransactions(supabase: any) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(todayStart.getDate() + 1)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(todayStart.getDate() - 1)

    const { count: today } = await supabase
      .from("cash_flows")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", tomorrowStart.toISOString())

    const { count: yesterday } = await supabase
      .from("cash_flows")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString())

    let change = yesterday > 0
      ? ((today! - yesterday) / yesterday) * 100
      : today > 0
        ? 100
        : 0

    return { value: today || 0, change }
  }

  async function fetchInactiveUsers(supabase: any) {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - 1)
    const pastCutoff = new Date()
    pastCutoff.setMonth(pastCutoff.getMonth() - 2)

    const { data } = await supabase
      .from("cash_flows")
      .select("user_id, created_at")

    const recentUsers = new Set(
      data?.filter((row: any) => new Date(row.created_at) > cutoff).map((r: any) => r.user_id)
    )
    const pastUsers = new Set(
      data?.filter((row: any) => new Date(row.created_at) > pastCutoff && new Date(row.created_at) <= cutoff)
        .map((r: any) => r.user_id)
    )

    const allUsers = new Set(data?.map((r: any) => r.user_id))
    const inactiveCount = [...allUsers].filter(u => !recentUsers.has(u)).length
    const previousInactiveCount = [...allUsers].filter(u => !pastUsers.has(u)).length

    let change = 0
    if (previousInactiveCount > 0) {
      change = ((inactiveCount - previousInactiveCount) / previousInactiveCount) * 100
    }

    return { value: inactiveCount, change }
  }

  async function fetchAverageEntries(supabase: any) {
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const firstDayThisMonthCopy = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data: thisMonth } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", firstDayThisMonth.toISOString())
      .lt("created_at", firstDayNextMonth.toISOString())

    const { data: lastMonth } = await supabase
      .from("cash_flows")
      .select("user_id")
      .gte("created_at", firstDayLastMonth.toISOString())
      .lt("created_at", firstDayThisMonthCopy.toISOString())

    const groupedThis: Record<string, number> = {}
    thisMonth?.forEach((r: { user_id: string | number }) => {
      groupedThis[r.user_id] = (groupedThis[r.user_id] || 0) + 1
    })
    const avgThis = thisMonth && Object.keys(groupedThis).length > 0
      ? Object.values(groupedThis).reduce((a, b) => a + b, 0) / Object.keys(groupedThis).length
      : 0

    const groupedLast: Record<string, number> = {}
    lastMonth?.forEach((r: { user_id: string | number }) => {
      groupedLast[r.user_id] = (groupedLast[r.user_id] || 0) + 1
    })
    const avgLast = lastMonth && Object.keys(groupedLast).length > 0
      ? Object.values(groupedLast).reduce((a, b) => a + b, 0) / Object.keys(groupedLast).length
      : 0

    let change = 0
    if (avgLast > 0) {
      change = ((avgThis - avgLast) / avgLast) * 100
    }

    return { value: avgThis.toFixed(1), change }
  }

async function fetchIncomeExpenseChart(supabase: any) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const { data } = await supabase
    .from("cash_flows")
    .select("flow_type, cash_flows_category_id_fkey(id, name)")
    .gte("created_at", cutoff.toISOString())

  const grouped: any = { income: {}, expense: {} }

  data?.forEach((row: any) => {
    const type = row.flow_type
    const catName = row.cash_flows_category_id_fkey?.name || "Other"

    if (!grouped[type][catName]) grouped[type][catName] = 0
    grouped[type][catName] += 1
  })

  const incomeData = Object.entries(grouped.income).map(([name, value]) => ({
    name,
    value,
  }))
  const expenseData = Object.entries(grouped.expense).map(([name, value]) => ({
    name,
    value,
  }))

  return { incomeData, expenseData }
}


  async function fetchDailyTransactionsChart(supabase: any) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const { data } = await supabase
      .from("cash_flows")
      .select("id, created_at")
      .gte("created_at", cutoff.toISOString());

    const grouped: Record<string, number> = {};

    data?.forEach((row: any) => {
      const dateKey = new Date(row.created_at).toISOString().split("T")[0]; // YYYY-MM-DD
      grouped[dateKey] = (grouped[dateKey] || 0) + 1; // jumlah row
    });


    const dailyData = Object.entries(grouped)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    return dailyData;
  }

  async function fetchChannelBreakdownChart(supabase: any) {
const { data } = await supabase
  .from("cash_flows")
  .select(`
    chat_channel_id,
    cash_flows_chat_channel_id_fkey(
      id,
      group_active_channel_name_fkey(
        id,
        name
      )
    )
  `)

    const grouped: Record<string, number> = {};

    data?.forEach((row: any) => {
      const channelName = row.cash_flows_chat_channel_id_fkey?.group_active_channel_name_fkey?.name || "Unknown";
      if (!grouped[channelName]) grouped[channelName] = 0;
      grouped[channelName] += 1;
    });

    const channelData = Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value),
    }));

    return channelData;
  }


  // === Init useEffect ===
  useEffect(() => {
    const init = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoggedIn(false)
        setLoading(false)
        return
      }
      setUser(user)

const [
  newUsers,
  mau,
  dau,
  todayTx,
  inactive,
  avgEntries,
  incomeExpenseChart,
  dailyData,
  channelData,
] = await Promise.all([
  fetchNewUsers(supabase),
  fetchMonthlyActiveUsers(supabase),
  fetchDailyActiveUsers(supabase),
  fetchTodayTransactions(supabase),
  fetchInactiveUsers(supabase),
  fetchAverageEntries(supabase),
  fetchIncomeExpenseChart(supabase),
  fetchDailyTransactionsChart(supabase),
  fetchChannelBreakdownChart(supabase),
]);

setStats({
  newUsers,
  mau,
  dau,
  todayTx,
  inactive,
  avgEntries,
  chart: {
    incomeData: incomeExpenseChart.incomeData,
    expenseData: incomeExpenseChart.expenseData,
    dailyData,
    channelData,
  },
});




      setLoading(false)
    }

    init()
  }, [supabase, setAlertData])

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
      {/* Summary Cards */}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title={DASHBOARD_LABELS.newUsers.title}
          value={stats.newUsers?.value ?? 0}
          change={`${stats.newUsers?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.newUsers?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.newUsers.compare}
        />

        <StatCard
          title={DASHBOARD_LABELS.monthlyActiveUsers.title}
          value={stats.mau?.value ?? 0}
          change={`${stats.mau?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.mau?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.monthlyActiveUsers.compare}
        />

        <StatCard
          title={DASHBOARD_LABELS.dailyActiveUsers.title}
          value={stats.dau?.value ?? 0}
          change={`${stats.dau?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.dau?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.dailyActiveUsers.compare}
        />

        <StatCard
          title={DASHBOARD_LABELS.todayTransactions.title}
          value={stats.todayTx?.value ?? 0}
          change={`${stats.todayTx?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.todayTx?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.todayTransactions.compare}
        />

        <StatCard
          title={DASHBOARD_LABELS.inactiveUsers.title}
          value={stats.inactive?.value ?? 0}
          change={`${stats.inactive?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.inactive?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.inactiveUsers.compare}
        />

        <StatCard
          title={DASHBOARD_LABELS.averageEntries.title}
          value={stats.avgEntries?.value ?? 0}
          change={`${stats.avgEntries?.change > 0 ? "↑" : "↓"} ${Math.abs(stats.avgEntries?.change ?? 0).toFixed(1)}%`}
          compare={DASHBOARD_LABELS.averageEntries.compare}
        />
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieCart
          title={DASHBOARD_LABELS.incomeChart.title}
          data={stats.chart?.incomeData ?? []}
          total={stats.chart?.incomeData?.reduce((a: number, b: any) => a + b.value, 0) ?? 0}
        />
        <PieCart
          title={DASHBOARD_LABELS.expenseChart.title}
          data={stats.chart?.expenseData ?? []}
          total={stats.chart?.expenseData?.reduce((a: number, b: any) => a + b.value, 0) ?? 0}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Daily Transactions */}
        <LineChartCard
          title={DASHBOARD_LABELS.dailyTransactions.title}
          data={stats.chart?.dailyData ?? []}
        />

        {/* Channel Breakdown */}
        <PieChartCard
          title={DASHBOARD_LABELS.channelBreakdown.title}
          data={stats.chart?.channelData ?? []}
        />
      </div>
    </div>
  )
}
