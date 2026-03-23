"use client";

import { useState } from "react";
import { kpiTargets } from "@/data/mockData";

export default function KPITargetsPage() {
  const [targets, setTargets] = useState(kpiTargets);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">KPI Targets & Settings</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-slate-600">
          Configure target values and alert thresholds for each KPI. Alerts will
          be triggered when actual values deviate from these targets.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Alert Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {targets.map((row, i) => (
                <tr key={row.metric} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.metric}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={row.target}
                      className="w-24 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={row.threshold}
                      className="w-24 rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
