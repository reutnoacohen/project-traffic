"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const INTERNAL_FIELDS = [
  { key: "date", label: "Date" },
  { key: "source", label: "Source / Media" },
  { key: "campaignName", label: "Campaign Name" },
  { key: "installs", label: "Installs" },
  { key: "clicks", label: "Clicks" },
  { key: "spend", label: "Spend / Cost" },
  { key: "revenue", label: "Revenue" },
  { key: "signups", label: "Signups" },
  { key: "fraudCount", label: "Fraud Count" },
];

export default function CampaignMappingPage() {
  const params = useParams();
  const id = params.id as string;
  const [mapping, setMapping] = useState<Record<string, string>>({
    date: "Install Time",
    source: "Media Source",
    campaignName: "Campaign",
    installs: "Installs",
    clicks: "Clicks",
    spend: "Cost",
    revenue: "Revenue",
    signups: "Signups",
    fraudCount: "Fraud",
  });
  const commonColumns = [
    "Install Time", "Media Source", "Campaign", "Installs", "Clicks",
    "Cost", "Revenue", "Signups", "Fraud", "media_source", "cost", "install_time",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/campaigns/${id}`} className="text-indigo-600 hover:text-indigo-700">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Column Mapping</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-6 text-slate-600">
          Map AppsFlyer/source columns to internal fields. Used when importing raw data.
        </p>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-slate-600">Internal Field</th>
              <th className="text-left text-sm font-medium text-slate-600">Maps To (Source Column)</th>
            </tr>
          </thead>
          <tbody>
            {INTERNAL_FIELDS.map((f) => (
              <tr key={f.key} className="border-t border-slate-100">
                <td className="py-3 text-sm font-medium text-slate-800">{f.label}</td>
                <td className="py-3">
                  <input
                    type="text"
                    value={mapping[f.key] ?? ""}
                    onChange={(e) => setMapping((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.key}
                    list={`list-${f.key}`}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                  <datalist id={`list-${f.key}`}>
                    {commonColumns.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-slate-500">
          Mapping is applied at import. To change how future uploads are parsed, update here and re-upload.
        </p>
      </div>
    </div>
  );
}
