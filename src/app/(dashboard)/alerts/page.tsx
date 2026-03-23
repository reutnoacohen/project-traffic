"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

interface Alert {
  id: string;
  type: string;
  severity: string;
  metric: string | null;
  expected: string | null;
  actual: string | null;
  createdAt: string;
  campaign?: { id: string; offerName: string } | null;
  details?: string | null;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = severityFilter === "all"
      ? "/api/alerts"
      : `/api/alerts?severity=${severityFilter}`;
    fetch(url)
      .then((r) => r.json())
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, [severityFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Alerts & Anomalies
        </h1>
        <div className="flex gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading...
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No alerts match your filters
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-2 p-6 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{alert.metric ?? alert.type}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm text-slate-600">
                      Expected: {alert.expected ?? "—"} → Actual: {alert.actual ?? "—"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(alert.createdAt).toLocaleString()}
                    {alert.campaign && (
                      <>
                        {" • "}
                        <Link href={`/campaigns/${alert.campaign.id}`} className="text-indigo-600 hover:underline">
                          {alert.campaign.offerName}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={alert.severity as "high" | "medium" | "low"} />
                  {alert.campaign && (
                    <Link
                      href={`/campaigns/${alert.campaign.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View campaign
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">
          About Alerts
        </h2>
        <p className="text-sm text-slate-600">
          Alerts are triggered when metrics deviate from configured targets or
          when anomalies are detected. Configure thresholds in Campaign Setup and
          KPI Targets. Future: AI-generated insights will appear here.
        </p>
      </div>
    </div>
  );
}
