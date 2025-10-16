"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

interface MetricsProps {
  isAdmin: boolean
  userId: string
}

export const Metrics: React.FC<MetricsProps> = ({ isAdmin, userId }) => {
  const supabase = createClient();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalSubs, setTotalSubs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        // Hitung jumlah subscriptions
        const { count: subsCount } = await supabase
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true });
        setTotalSubs(subsCount || 0);

        // Hitung total revenue dari payments yang paid
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("amount_paid")
          .eq("payment_status", "paid");

        const revenue = paymentsData?.reduce(
          (sum, p) => sum + (p.amount_paid || 0),
          0
        ) || 0;
        setTotalRevenue(revenue);
      } else {
        // Hitung income
        const { data: incomeData } = await supabase
          .from("cash_flows")
          .select("flow_amount")
          .eq("user_id", userId)
          .eq("flow_type", "income");

        const incomeTotal = incomeData?.reduce(
          (sum, c) => sum + (c.flow_amount || 0),
          0
        ) || 0;
        setIncome(incomeTotal);

        // Hitung expense
        const { data: expenseData } = await supabase
          .from("cash_flows")
          .select("flow_amount")
          .eq("user_id", userId)
          .eq("flow_type", "expense");

        const expenseTotal = expenseData?.reduce(
          (sum, c) => sum + (c.flow_amount || 0),
          0
        ) || 0;
        setExpense(expenseTotal);
      }

      setLoading(false);
    };

    fetchData();
  }, [isAdmin, supabase, userId]);

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {isAdmin ? (
        <>
          {/* Total Subscriptions */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">User Subscriptions</span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {totalSubs}
              </h4>
            </div>
          </div>
  
          {/* Total Revenue */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 dark:text-white/90" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ${totalRevenue.toLocaleString()}
              </h4>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Income */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Income</span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ${income.toLocaleString()}
              </h4>
            </div>
          </div>
  
          {/* Expense */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 dark:text-white/90" />
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Expense</span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ${expense.toLocaleString()}
              </h4>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
};
