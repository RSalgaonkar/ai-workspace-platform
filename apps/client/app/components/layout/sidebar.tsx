"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Users
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },

  {
    label: "Workspace",
    href: "/workspace",
    icon: Users
  },

  {
    label: "Chat",
    href: "/chat",
    icon: MessageSquare
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-72 flex-col border-r border-slate-200 bg-white p-5 text-slate-900 shadow-sm md:flex"
      aria-label="Primary navigation"
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
          <Sparkles
            size={19}
            aria-hidden="true"
          />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            AI Workspace
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Collaborative command center
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
            >
              <Icon
                size={18}
                aria-hidden="true"
              />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-950">
          Production mode
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Workspace, chat, and access flows are ready for team workflows.
        </p>
      </div>
    </aside>
  );
}
