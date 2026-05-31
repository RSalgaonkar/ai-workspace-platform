"use client";

import { ReactNode } from "react";

import CommandPalette from "./command-palette";

import Sidebar from "./sidebar";

type Props = {
  children: ReactNode;
};

export default function DashboardShell({
  children
}: Props) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-950">
      <Sidebar />
      <CommandPalette />

      <main
        id="main-content"
        className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        tabIndex={-1}
      >
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
