"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignSetupForm from "@/components/CampaignSetupForm";
import BriefParserPanel from "@/components/BriefParserPanel";

export default function NewCampaignPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"form" | "brief">("form");
  const [parsedFormData, setParsedFormData] = useState<Record<string, unknown> | null>(null);

  const handleParsed = (formData: Record<string, unknown>) => {
    setParsedFormData(formData);
    setTab("form");
  };

  const handleSaved = (id: string) => {
    router.push(`/campaigns/${id}`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">New Campaign</h1>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("form")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "form"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-800"
          }`}
        >
          Manual Setup
        </button>
        <button
          onClick={() => setTab("brief")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "brief"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-800"
          }`}
        >
          Paste Brief (AI Parse)
        </button>
      </div>

      {tab === "form" ? (
        <CampaignSetupForm
          initialData={parsedFormData ?? undefined}
          onSaved={handleSaved}
          onClearParsed={() => setParsedFormData(null)}
        />
      ) : (
        <BriefParserPanel onParsed={handleParsed} />
      )}
    </div>
  );
}
