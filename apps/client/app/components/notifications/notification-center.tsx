"use client";

import { Bell } from "lucide-react";

export default function NotificationCenter() {
  return (
    <button
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
      aria-label="Notifications"
    >
      <Bell
        size={18}
        aria-hidden="true"
      />

      <span
        className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"
        aria-hidden="true"
      />
    </button>
  );
}
