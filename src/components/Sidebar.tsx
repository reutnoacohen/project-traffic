"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/campaigns", label: "All Campaigns", icon: "📁", section: "campaigns" },
  { href: "/campaigns/new", label: "New Campaign", icon: "➕", section: "campaigns" },
  { href: "/", label: "Dashboard", icon: "📊", section: "main" },
  { href: "/upload", label: "Upload Reports", icon: "📤", section: "main" },
  { href: "/upload-history", label: "Upload History", icon: "📋", section: "main" },
  { href: "/client-report", label: "Client Report", icon: "👤", section: "reports" },
  { href: "/publisher-report", label: "Publisher Report", icon: "📢", section: "reports" },
  { href: "/alerts", label: "Alerts & Anomalies", icon: "⚠️", section: "alerts" },
  { href: "/settings/kpi", label: "KPI Targets", icon: "🎯", section: "settings" },
  { href: "/settings/mapping", label: "Mapping", icon: "🔗", section: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  const sections = [
    { id: "campaigns", label: "Campaigns" },
    { id: "main", label: "Main" },
    { id: "reports", label: "Reports" },
    { id: "alerts", label: "Alerts" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-slate-50">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/" className="text-xl font-bold text-slate-800">
            Traffic Reporter
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {sections.map((section) => {
            const items = navItems.filter((i) => i.section === section.id);
            if (items.length === 0) return null;
            return (
              <div key={section.id}>
                <div className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {section.label}
                </div>
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
