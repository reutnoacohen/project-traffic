"use client";

import { useState } from "react";
import type { ExtractedField } from "@/lib/campaign-brief-parser";

interface ParserResponse {
  extracted: ExtractedField[];
  missingRequired: string[];
  suggestions: string[];
  formData: Record<string, unknown>;
}

interface Props {
  onParsed: (formData: Record<string, unknown>) => void;
}

export default function BriefParserPanel({ onParsed }: Props) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ParserResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/campaigns/parse-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        extracted: [],
        missingRequired: ["offer_name"],
        suggestions: ["Failed to parse. Try again."],
        formData: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseExtracted = () => {
    if (result?.formData) {
      onParsed(result.formData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Paste campaign brief, offer terms, KPI definitions, caps, payouts, exclusions
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example:&#10;Offer: My App Install Campaign&#10;af_prt: partner123&#10;Payout: $12&#10;Excluded: CA, TX&#10;CPA max: $13&#10;Daily install cap: 10000"
          rows={10}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm"
        />
      </div>
      <button
        onClick={handleParse}
        disabled={loading || !text.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Parsing..." : "Extract Fields"}
      </button>

      {result && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-800">Extracted Fields</h2>

          {result.missingRequired.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Missing required:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-amber-700">
                {result.missingRequired.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {result.extracted.length > 0 ? (
            <div className="space-y-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-slate-600">Field</th>
                    <th className="text-left font-medium text-slate-600">Value</th>
                    <th className="text-left font-medium text-slate-600">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {result.extracted.map((e) => (
                    <tr key={e.key} className="border-t border-slate-100">
                      <td className="py-2 text-slate-800">{e.key}</td>
                      <td className="py-2 text-slate-700">
                        {Array.isArray(e.value) ? e.value.join(", ") : String(e.value)}
                      </td>
                      <td className="py-2">
                        <span
                          className={
                            e.confidence >= 0.9
                              ? "text-green-600"
                              : e.confidence >= 0.7
                                ? "text-amber-600"
                                : "text-slate-500"
                          }
                        >
                          {Math.round(e.confidence * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No fields extracted. Try adding more structured text.</p>
          )}

          {result.suggestions.length > 0 && (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Suggestions:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleUseExtracted}
            disabled={result.extracted.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Use in Form
          </button>
        </div>
      )}
    </div>
  );
}
