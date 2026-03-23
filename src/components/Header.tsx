"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-800">
          AppsFlyer Traffic Reporting
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Demo User</span>
        <Link
          href="/login"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Logout
        </Link>
      </div>
    </header>
  );
}
