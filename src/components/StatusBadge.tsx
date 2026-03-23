type Status = "completed" | "processing" | "failed" | "high" | "medium" | "low" | "draft" | "active" | "paused";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<Status, { bg: string; text: string; defaultLabel: string }> = {
  completed: { bg: "bg-green-100", text: "text-green-800", defaultLabel: "Completed" },
  processing: { bg: "bg-amber-100", text: "text-amber-800", defaultLabel: "Processing" },
  failed: { bg: "bg-red-100", text: "text-red-800", defaultLabel: "Failed" },
  high: { bg: "bg-red-100", text: "text-red-800", defaultLabel: "High" },
  medium: { bg: "bg-amber-100", text: "text-amber-800", defaultLabel: "Medium" },
  low: { bg: "bg-slate-100", text: "text-slate-700", defaultLabel: "Low" },
  draft: { bg: "bg-slate-100", text: "text-slate-700", defaultLabel: "Draft" },
  active: { bg: "bg-green-100", text: "text-green-800", defaultLabel: "Active" },
  paused: { bg: "bg-amber-100", text: "text-amber-800", defaultLabel: "Paused" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { bg: "bg-slate-100", text: "text-slate-700", defaultLabel: status };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {label ?? config.defaultLabel}
    </span>
  );
}
