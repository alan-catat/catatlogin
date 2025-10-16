// config/variables.tsx

export const DASHBOARD_LABELS = {
  // Stat Cards
  newUsers: {
    title: "New Users this week",
    compare: "vs last week",
  },
  monthlyActiveUsers: {
    title: "Monthly Active Users",
    compare: "vs last month",
  },
  dailyActiveUsers: {
    title: "Daily Active Users",
    compare: "vs yesterday",
  },
  todayTransactions: {
    title: "Today Transactions",
    compare: "vs yesterday",
  },
  inactiveUsers: {
    title: "Inactive Users",
    compare: "vs last 3 months",
  },
  averageEntries: {
    title: "Average Entries per User",
    compare: "vs last month",
  },

  // Charts
  incomeChart: {
    title: "Income Category Entries breakdown last 30 days",
  },
  expenseChart: {
    title: "Expense Category Entries breakdown last 30 days",
  },
  dailyTransactions: {
    title: "Daily User Transaction Entries Activity",
  },
  channelBreakdown: {
    title: "Channel Entries Favorite Breakdown",
  },

}


export const settingsTabs = [
  { id: "general", label: "General" },
  { id: "logo", label: "Logo" },
  { id: "payment", label: "Payment" },
  { id: "account", label: "Account Settings" },
  { id: "api", label: "API Settings" },
  { id: "roles", label: "Admin Roles" },
];

export const defaultSystemKeys = {
  APP_NAME: "My App",
  DEFAULT_CURRENCY: "IDR",
  TIMEZONE: "Asia/Jakarta",
  LOGO_APP: "",
  LOGO_FAVICON: "",
  LOGO_DARK: "",
  PAYMENT_METHOD: "manual", // manual | gateway
};


// 🔹 Untuk User Dashboard Overview
export const USER_OVERVIEWS = {
  // Stat Cards
  totalBalance: {
    title: "Balance",
    compare: "vs last month",
  },
  totalIncome: {
    title: "Income",
    compare: "vs last month",
  },
  totalExpense: {
    title: "Expense",
    compare: "vs last month",
  },
  entries: {
    title: "Total Entry this month",
    compare: "vs last month",
  },

  // Charts
  incomeChart: {
    title: "Income Category",
  },
  expenseChart: {
    title: "Expense Category",
  },
  // Charts
  incomeChartBreakdown: {
    title: "Income Category Breakdown",
  },
  expenseChartBreakdown: {
    title: "Expense Category Breakdown",
  },
};
