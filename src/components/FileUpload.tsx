"use client";

import { useState } from "react";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) handleFiles(files);
  };

  const handleFiles = (_files: FileList) => {
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
        isDragging
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-300 bg-slate-50 hover:border-slate-400"
      }`}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl">
          📄
        </div>
        <p className="text-lg font-medium text-slate-700">
          Drag & drop your AppsFlyer report here, or click to browse
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Supports Excel (.xlsx, .xls) and CSV files
        </p>
      </label>
      {uploaded && (
        <p className="mt-4 text-sm font-medium text-green-600">
          ✓ File received (demo mode — no actual upload)
        </p>
      )}
    </div>
  );
}
