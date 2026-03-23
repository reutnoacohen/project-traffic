"use client";

import StatusBadge from "@/components/StatusBadge";
import { mappingConfig } from "@/data/mockData";

export default function MappingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Column Mapping</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-slate-600">
          Map AppsFlyer report columns to internal data fields. This ensures
          uploaded reports are parsed correctly.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  AppsFlyer Column
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Mapped To
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mappingConfig.map((row) => (
                <tr key={row.appsflyerColumn} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.appsflyerColumn}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.mappedTo}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={
                        row.status === "mapped" ? "completed" : "processing"
                      }
                      label={row.status === "mapped" ? "Mapped" : "Pending"}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
          Add Mapping
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">
          Auto-Detection
        </h2>
        <p className="text-sm text-slate-600">
          When backend is implemented, the system will auto-detect common
          AppsFlyer column names and suggest mappings. You can override or add
          custom mappings here.
        </p>
      </div>
    </div>
  );
}
