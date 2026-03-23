"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface RawDataUpload {
  id: string;
  fileName: string | null;
  sourceType: string;
  status: string;
  rowsCount: number | null;
  createdAt: string;
}

export default function CampaignRawDataPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [uploads, setUploads] = useState<RawDataUpload[]>([]);
  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [pasteText, setPasteText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetch(`/api/campaigns/${id}/raw-data`)
      .then((r) => r.json())
      .then(setUploads);
  }, [id]);

  const mapRow = (row: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    const num = (v: unknown) => (typeof v === "number" ? v : parseFloat(String(v)) || 0);
    const int = (v: unknown) => Math.round(num(v));
    for (const [internal, external] of Object.entries(mapping)) {
      let val = row[external] ?? row[external.toLowerCase()];
      if (val === undefined || val === null || val === "") continue;
      if (["installs", "clicks", "signups", "fraudCount"].includes(internal)) {
        val = int(val);
      } else if (["spend", "revenue"].includes(internal)) {
        val = num(val);
      }
      out[internal] = val;
    }
    return out;
  };

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) return;
    setLoading(true);
    try {
      const lines = pasteText.trim().split("\n");
      const headers = lines[0].split(/[\t,]/).map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const vals = line.split(/[\t,]/).map((v) => v.trim());
        const obj: Record<string, unknown> = {};
        headers.forEach((h, i) => {
          obj[h] = vals[i] ?? "";
        });
        return mapRow(obj);
      });
      await fetch(`/api/campaigns/${id}/raw-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "paste",
          rawText: pasteText.slice(0, 5000),
          rows,
        }),
      });
      setPasteText("");
      const res = await fetch(`/api/campaigns/${id}/raw-data`);
      const data = await res.json();
      setUploads(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const parseRes = await fetch("/api/upload/parse", { method: "POST", body: fd });
      const { rows } = await parseRes.json();
      const mapped = rows.map((r: Record<string, unknown>) => mapRow(r));
      await fetch(`/api/campaigns/${id}/raw-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "upload",
          fileName: file.name,
          rows: mapped,
        }),
      });
      setFile(null);
      const res = await fetch(`/api/campaigns/${id}/raw-data`);
      const data = await res.json();
      setUploads(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/campaigns/${id}`} className="text-indigo-600 hover:text-indigo-700">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Raw Data</h1>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("upload")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "upload" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-600"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "paste" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-600"
          }`}
        >
          Paste Data
        </button>
      </div>

      {tab === "upload" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={handleFileUpload}
            disabled={!file || loading}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {tab === "paste" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-2 text-sm text-slate-600">
            Paste tab or comma-separated data. First row = headers.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="date	source	installs	clicks	cost	revenue&#10;2025-03-20	Google	1000	5000	12000	25000"
            rows={8}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim() || loading}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Import"}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <h2 className="border-b border-slate-200 p-4 font-semibold text-slate-800">
          Upload History
        </h2>
        {uploads.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No uploads yet</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">File / Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u.id} className="border-b border-slate-100">
                  <td className="px-6 py-4 text-sm text-slate-800">{u.fileName ?? "Pasted"}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.sourceType}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.rowsCount ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
