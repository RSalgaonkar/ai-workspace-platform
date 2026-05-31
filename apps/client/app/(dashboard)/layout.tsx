"use client";

import { ReactNode } from "react";

import { useEffect } from "react";

import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

import DashboardShell from "@/components/layout/dashboard-shell";

import {
  useAuthStore
} from "@/types/auth.store";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({
  children
}: Props) {
  const router = useRouter();

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading
    );

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated
    ) {
      router.replace("/");
    }
  }, [
    isAuthenticated,
    isLoading,
    router
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-950">
        <div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2
            size={18}
            className="animate-spin text-slate-500"
            aria-hidden="true"
          />
          Loading workspace
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-950">
        <div
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2
            size={18}
            className="animate-spin text-slate-500"
            aria-hidden="true"
          />
          Redirecting to home
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
