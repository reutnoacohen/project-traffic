"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface KpiResult {
  summary: {
    totalInstalls: number;
    totalClicks: number;
    totalSpend: number;
    totalRevenue: number;
    totalSignups: number;
    totalFraud: number;
  };
  computed: Record<
    string,
    { actual: number; unit: string; label: string }
  >;
  evaluation: Array<{
    metric: string;
    label: string;
    actual: number;
    target: number;
    operator: string;
    pass: boolean;
  }>;
}

export default function CampaignKpiPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<KpiResult | null>(null);

  useEffect(() => {
    fetch(`/api/campaigns/${id}/kpi`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const { summary, computed, evaluation } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/campaigns/${id}`} className="text-indigo-600 hover:text-indigo-700">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">KPI Evaluation</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <p className="text-xs text-slate-500">Installs</p>
            <p className="font-semibold text-slate-800">{summary.totalInstalls.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Clicks</p>
            <p className="font-semibold text-slate-800">{summary.totalClicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Spend</p>
            <p className="font-semibold text-slate-800">${summary.totalSpend.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="font-semibold text-slate-800">${summary.totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Signups</p>
            <p className="font-semibold text-slate-800">{summary.totalSignups.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Fraud</p>
            <p className="font-semibold text-slate-800">{summary.totalFraud}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Computed KPIs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(computed).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">{v.label}</p>
              <p className="text-lg font-bold text-slate-800">
                {v.unit === "$" && "$"}
                {v.actual.toFixed(2)}
                {v.unit === "%" && "%"}
                {v.unit === "x" && "x"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Rule Evaluation</h2>
        {evaluation.length === 0 ? (
          <p className="text-slate-500">
            No KPI rules configured. Add rules in Campaign Setup.
          </p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-slate-600">Metric</th>
                <th className="text-left text-sm font-medium text-slate-600">Actual</th>
                <th className="text-left text-sm font-medium text-slate-600">Target</th>
                <th className="text-left text-sm font-medium text-slate-600">Result</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.map((e) => (
                <tr key={e.metric} className="border-t border-slate-100">
                  <td className="py-3 text-slate-800">{e.label}</td>
                  <td className="py-3 text-slate-700">{e.actual.toFixed(2)}</td>
                  <td className="py-3 text-slate-700">
                    {e.operator} {e.target}
                  </td>
                  <td className="py-3">
                    <span
                      className={
                        e.pass ? "text-green-600 font-medium" : "text-red-600 font-medium"
                      }
                    >
                      {e.pass ? "✓ Pass" : "✗ Fail"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
