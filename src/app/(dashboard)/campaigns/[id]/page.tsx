"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import AICopilotPanel from "@/components/AICopilotPanel";

interface Campaign {
  id: string;
  offerName: string;
  status: string;
  afPrt: string | null;
  payoutWeGet: number | null;
  budget: number | null;
  rawDataRows: Array<{ date: string; installs: number; spend: number }>;
  alerts: Array<{ id: string; type: string; severity: string; metric: string; actual: string }>;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json())
      .then(setCampaign)
      .catch(() => router.push("/campaigns"));
  }, [id, router]);

  if (!campaign) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const totalInstalls = campaign.rawDataRows?.reduce((s, r) => s + r.installs, 0) ?? 0;
  const totalSpend = campaign.rawDataRows?.reduce((s, r) => s + r.spend, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{campaign.offerName}</h1>
          <div className="mt-2 flex items-center gap-4">
            <StatusBadge
              status={campaign.status as "draft" | "active" | "paused"}
            />
            {campaign.afPrt && (
              <span className="text-sm text-slate-500">af_prt: {campaign.afPrt}</span>
            )}
            {campaign.payoutWeGet != null && (
              <span className="text-sm text-slate-600">Payout: ${campaign.payoutWeGet}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Installs</p>
          <p className="text-xl font-bold text-slate-800">{totalInstalls.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Spend</p>
          <p className="text-xl font-bold text-slate-800">${totalSpend.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Data Rows</p>
          <p className="text-xl font-bold text-slate-800">{campaign.rawDataRows?.length ?? 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Alerts</p>
          <p className="text-xl font-bold text-slate-800">{campaign.alerts?.length ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/campaigns/${id}/raw-data`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Raw Data
        </Link>
        <Link
          href={`/campaigns/${id}/mapping`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Mapping
        </Link>
        <Link
          href={`/campaigns/${id}/kpi`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          KPI Evaluation
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Recent Alerts</h2>
          {campaign.alerts?.length ? (
            <ul className="space-y-2">
              {campaign.alerts.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm text-slate-800">{a.metric}: {a.actual}</span>
                  <StatusBadge status={a.severity as "high" | "medium" | "low"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No alerts</p>
          )}
        </div>
        <AICopilotPanel campaignId={id} campaignName={campaign.offerName} />
      </div>
    </div>
  );
}
