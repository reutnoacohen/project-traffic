"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  offerName: string;
  status: string;
  afPrt: string | null;
  payoutWeGet: number | null;
  _count?: { rawDataRows: number; alerts: number };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Campaigns</h1>
        <Link
          href="/campaigns/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">No campaigns yet.</p>
          <Link
            href="/campaigns/new"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
          >
            Create your first campaign →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-slate-800">{c.offerName}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.status === "active"
                      ? "bg-green-100 text-green-800"
                      : c.status === "paused"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              {c.afPrt && (
                <p className="mt-1 text-sm text-slate-500">af_prt: {c.afPrt}</p>
              )}
              {c.payoutWeGet != null && (
                <p className="mt-1 text-sm text-slate-600">
                  Payout: ${c.payoutWeGet}
                </p>
              )}
              {c._count && (
                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                  <span>{c._count.rawDataRows} rows</span>
                  <span>{c._count.alerts} alerts</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
