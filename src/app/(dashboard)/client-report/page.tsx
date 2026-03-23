"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clientReportData, installsTrendData } from "@/data/mockData";

export default function ClientReportPage() {
  const [selectedClient, setSelectedClient] = useState("All Clients");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Client Report</h1>
        <div className="flex gap-2">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All Clients">All Clients</option>
            {clientReportData.map((c) => (
              <option key={c.client} value={c.client}>
                {c.client}
              </option>
            ))}
          </select>
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Client Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Client
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                  Installs
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                  Spend
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                  CPA
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                  ROAS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clientReportData.map((row) => (
                <tr key={row.client} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.client}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {row.installs.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ${row.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ${row.cpa}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {row.roas}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Installs Trend by Client
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={installsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
