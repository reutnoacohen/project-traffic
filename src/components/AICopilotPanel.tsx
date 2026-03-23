"use client";

import { useState } from "react";
import { escapeHtml } from "@/lib/sanitize";

interface Props {
  campaignId: string;
  campaignName: string;
}

export default function AICopilotPanel({ campaignId, campaignName }: Props) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setReply(data.message);
    } catch {
      setReply("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">AI Copilot</h2>
      <p className="mb-4 text-sm text-slate-500">
        Ask questions about {campaignName}. Try: &quot;Summarize this campaign&quot;, &quot;Is it safe to scale?&quot;
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      {reply && (
        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 prose prose-sm max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: escapeHtml(reply)
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      )}
    </div>
  );
}
