import FileUpload from "@/components/FileUpload";

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Upload Reports</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-slate-600">
          Upload your AppsFlyer Excel or CSV reports. The system will parse
          traffic data, calculate KPIs, and make it available in dashboards and
          reports.
        </p>
        <FileUpload />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Supported Formats
        </h2>
        <ul className="list-inside list-disc space-y-2 text-slate-600">
          <li>Excel (.xlsx, .xls)</li>
          <li>CSV (.csv)</li>
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          After upload, you can view processing status in Upload History.
        </p>
      </div>
    </div>
  );
}
