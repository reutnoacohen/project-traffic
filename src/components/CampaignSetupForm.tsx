"use client";

import { useState } from "react";

interface FormData {
  offerName?: string;
  afPrt?: string;
  previewUrl?: string;
  mmp?: string;
  os?: string;
  excludedStates?: string;
  payoutWeGet?: number;
  payoutPo?: number;
  budget?: number;
  payableEvents?: string;
  vtaEnabled?: boolean;
  dummyAllowed?: boolean;
  ctvEnabled?: boolean;
  kpiBaseline?: string;
  vtaLookbackDays?: number;
  ctaMinInstall?: number;
  ctaMinClick?: number;
  installToSignupMin?: number;
  fraudMaxPct?: number;
  fraudTool?: string;
  trackingParamTemplate?: string;
  onelinkTemplate?: string;
  creativesLink?: string;
  notes?: string;
  status?: string;
  caps?: Array<{ capType: string; value: number; unit?: string }>;
  kpiRules?: Array<{
    metric: string;
    operator: "min" | "max";
    thresholdValue: number;
    thresholdUnit?: string;
  }>;
}

interface Props {
  initialData?: Record<string, unknown>;
  onSaved: (id: string) => void;
  onClearParsed?: () => void;
}

const FIELD_MAP: Record<string, string> = {
  offer_name: "offerName",
  af_prt: "afPrt",
  preview_url: "previewUrl",
  payout_we_get: "payoutWeGet",
  payout_po: "payoutPo",
  excluded_states: "excludedStates",
  vta_enabled: "vtaEnabled",
  dummy_allowed: "dummyAllowed",
  ctv_enabled: "ctvEnabled",
  vta_lookback_days: "vtaLookbackDays",
  cta_min_install: "ctaMinInstall",
  cta_min_click: "ctaMinClick",
  install_to_signup_min: "installToSignupMin",
  fraud_max_pct: "fraudMaxPct",
  fraud_tool: "fraudTool",
  tracking_param_template: "trackingParamTemplate",
  onelink_template: "onelinkTemplate",
  creatives_link: "creativesLink",
};

export default function CampaignSetupForm({
  initialData,
  onSaved,
  onClearParsed,
}: Props) {
  const mapInitial = (): FormData => {
    if (!initialData) return {};
    const d: FormData = {};
    for (const [k, v] of Object.entries(initialData)) {
      const key = FIELD_MAP[k] ?? k;
      (d as Record<string, unknown>)[key] = v;
    }
    if (initialData.caps && Array.isArray(initialData.caps)) {
      d.caps = initialData.caps as FormData["caps"];
    }
    return d;
  };

  const [form, setForm] = useState<FormData>(() => ({
    offerName: "",
    status: "draft",
    vtaEnabled: false,
    dummyAllowed: false,
    ctvEnabled: false,
    ...mapInitial(),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof FormData, v: unknown) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        os: form.os ? (Array.isArray(form.os) ? JSON.stringify(form.os) : form.os) : undefined,
        excludedStates: form.excludedStates
          ? (Array.isArray(form.excludedStates)
              ? JSON.stringify(form.excludedStates)
              : form.excludedStates)
          : undefined,
        payableEvents: form.payableEvents
          ? (Array.isArray(form.payableEvents)
              ? JSON.stringify(form.payableEvents)
              : form.payableEvents)
          : undefined,
      };
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? "Failed to save");
      }
      const { id } = await res.json();
      onSaved(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {initialData && onClearParsed && (
        <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-4">
          <p className="text-sm text-indigo-800">
            Form pre-filled from brief. Review and edit before saving.
          </p>
          <button
            type="button"
            onClick={onClearParsed}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Offer Name *</label>
          <input
            type="text"
            required
            value={form.offerName ?? ""}
            onChange={(e) => update("offerName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">af_prt</label>
          <input
            type="text"
            value={form.afPrt ?? ""}
            onChange={(e) => update("afPrt", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Preview URL</label>
          <input
            type="url"
            value={form.previewUrl ?? ""}
            onChange={(e) => update("previewUrl", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">MMP</label>
          <input
            type="text"
            value={form.mmp ?? ""}
            onChange={(e) => update("mmp", e.target.value)}
            placeholder="AppsFlyer, Adjust, etc."
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">OS</label>
          <input
            type="text"
            value={Array.isArray(form.os) ? form.os.join(", ") : (form.os ?? "")}
            onChange={(e) => update("os", e.target.value)}
            placeholder="iOS, Android"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Excluded States</label>
          <input
            type="text"
            value={Array.isArray(form.excludedStates) ? form.excludedStates.join(", ") : (form.excludedStates ?? "")}
            onChange={(e) => update("excludedStates", e.target.value)}
            placeholder="CA, TX, NY"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Payout (We Get)</label>
          <input
            type="number"
            step="0.01"
            value={form.payoutWeGet ?? ""}
            onChange={(e) => update("payoutWeGet", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Payout (PO)</label>
          <input
            type="number"
            step="0.01"
            value={form.payoutPo ?? ""}
            onChange={(e) => update("payoutPo", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Budget</label>
          <input
            type="number"
            step="0.01"
            value={form.budget ?? ""}
            onChange={(e) => update("budget", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Payable Events</label>
          <input
            type="text"
            value={form.payableEvents ?? ""}
            onChange={(e) => update("payableEvents", e.target.value)}
            placeholder="Install, Signup"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vtaEnabled ?? false}
              onChange={(e) => update("vtaEnabled", e.target.checked)}
            />
            <span className="text-sm text-slate-700">VTA Enabled</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.dummyAllowed ?? false}
              onChange={(e) => update("dummyAllowed", e.target.checked)}
            />
            <span className="text-sm text-slate-700">Dummy Allowed</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.ctvEnabled ?? false}
              onChange={(e) => update("ctvEnabled", e.target.checked)}
            />
            <span className="text-sm text-slate-700">CTV Enabled</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">VTA Lookback (days)</label>
          <input
            type="number"
            value={form.vtaLookbackDays ?? ""}
            onChange={(e) => update("vtaLookbackDays", e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">CTA Min Install</label>
          <input
            type="number"
            value={form.ctaMinInstall ?? ""}
            onChange={(e) => update("ctaMinInstall", e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">CTA Min Click</label>
          <input
            type="number"
            value={form.ctaMinClick ?? ""}
            onChange={(e) => update("ctaMinClick", e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Install-to-Signup Min (%)</label>
          <input
            type="number"
            step="0.1"
            value={form.installToSignupMin ?? ""}
            onChange={(e) => update("installToSignupMin", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fraud Max %</label>
          <input
            type="number"
            step="0.1"
            value={form.fraudMaxPct ?? ""}
            onChange={(e) => update("fraudMaxPct", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fraud Tool</label>
          <input
            type="text"
            value={form.fraudTool ?? ""}
            onChange={(e) => update("fraudTool", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Tracking Param Template</label>
          <textarea
            value={form.trackingParamTemplate ?? ""}
            onChange={(e) => update("trackingParamTemplate", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">OneLink Template</label>
          <textarea
            value={form.onelinkTemplate ?? ""}
            onChange={(e) => update("onelinkTemplate", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Creatives Link</label>
          <input
            type="url"
            value={form.creativesLink ?? ""}
            onChange={(e) => update("creativesLink", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Campaign"}
        </button>
        <select
          value={form.status ?? "draft"}
          onChange={(e) => update("status", e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>
    </form>
  );
}
