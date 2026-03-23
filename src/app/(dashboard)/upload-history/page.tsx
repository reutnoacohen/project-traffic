import StatusBadge from "@/components/StatusBadge";
import { uploadHistory } from "@/data/mockData";

export default function UploadHistoryPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Upload History</h1>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                File Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Rows Processed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {uploadHistory.map((upload) => (
              <tr key={upload.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {upload.fileName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {upload.date}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={upload.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {upload.rowsProcessed?.toLocaleString() ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
