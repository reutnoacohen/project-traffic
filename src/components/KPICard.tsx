import type { KPISummary } from "@/data/mockData";

interface KPICardProps {
  kpi: KPISummary;
}

const statusColors = {
  success: "border-l-green-500",
  warning: "border-l-amber-500",
  error: "border-l-red-500",
  neutral: "border-l-slate-400",
};

export default function KPICard({ kpi }: KPICardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${statusColors[kpi.status]} border-l-4`}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {kpi.label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
        <span
          className={`text-sm font-medium ${
            kpi.change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {kpi.change >= 0 ? "↑" : "↓"} {Math.abs(kpi.change)}%
        </span>
      </div>
      {kpi.target && (
        <div className="mt-2 text-xs text-slate-500">Target: {kpi.target}</div>
      )}
    </div>
  );
}
