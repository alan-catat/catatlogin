"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  group: {
    id: string;
    name: string;
  };
}

interface CashFlow {
  id: string;
  flow_items: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  flow_transaction_date: string;
  flow_qty: number;
  flow_unit: string;
  flow_merchant: string;
  category: Category;
}

interface CashFlowsTableProps {
  cashFlows: CashFlow[];
}

export default function StatisticsChart({ cashFlows }: CashFlowsTableProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Filter berdasarkan group
  const filteredCashFlows =
    selectedGroup === "all"
      ? cashFlows
      : cashFlows.filter((c) => c.category.group.name === selectedGroup);

  // Ambil daftar group unik untuk filter
  const groups = Array.from(
    new Set(cashFlows.map((c) => c.category.group.name))
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header section */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Cash Flows
        </h3>

        <div className="flex items-center gap-3">
          {/* Filter Group */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-theme-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">All Groups</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Merchant</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCashFlows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredCashFlows.map((cf) => (
                <TableRow key={cf.id}>
                  <TableCell>{cf.category.name}</TableCell>
                  <TableCell>{cf.category.group.name}</TableCell>
                  <TableCell>{cf.flow_items}</TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={cf.flow_type === "income" ? "success" : "error"}
                    >
                      {cf.flow_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{cf.flow_qty}</TableCell>
                  <TableCell>{cf.flow_unit}</TableCell>
                  <TableCell>${cf.flow_amount.toLocaleString()}</TableCell>
                  <TableCell>{cf.flow_merchant}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
