"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { publisherReportData } from "@/data/mockData";

export default function PublisherReportPage() {
  const [sortBy, setSortBy] = useState<"installs" | "cpa" | "roas">("installs");

  const sorted = [...publisherReportData].sort(
    (a, b) => (b[sortBy] as number) - (a[sortBy] as number)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Publisher Report</h1>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "installs" | "cpa" | "roas")
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="installs">Sort by Installs</option>
            <option value="cpa">Sort by CPA</option>
            <option value="roas">Sort by ROAS</option>
          </select>
          <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Publisher Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Publisher
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
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                  Retention D1
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sorted.map((row) => (
                <tr key={row.publisher} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.publisher}
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
                  <td className="px-6 py-4 text-right text-slate-600">
                    {row.retentionD1}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Installs by Publisher
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={publisherReportData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis
                dataKey="publisher"
                type="category"
                stroke="#64748b"
                fontSize={12}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="installs" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
