"use client";

import {
  Activity,
  CheckCircle2,
  MessageSquare,
  Rocket,
  Users
} from "lucide-react";

import Link from "next/link";

import PortfolioShowcase from "@/components/dashboard/portfolio-showcase";

import SystemHealthCard from "@/components/dashboard/system-health-card";

import Card from "@/components/ui/card";

import { useAuthStore } from "@/types/auth.store";

const stats = [
  {
    label: "Active workspace",
    value: "1",
    detail: "Default team space ready",
    icon: Users
  },
  {
    label: "Open channels",
    value: "1",
    detail: "General discussion enabled",
    icon: MessageSquare
  },
  {
    label: "System status",
    value: "Live",
    detail: "API and client are connected",
    icon: Activity
  }
];

export default function DashboardPage() {
  const user =
    useAuthStore(
      (state) => state.user
    );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Welcome back, {user?.name ?? "teammate"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Monitor your workspace activity, continue team conversations, and keep collaboration moving from one focused view.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          <CheckCircle2
            size={17}
            aria-hidden="true"
          />
          Ready for collaboration
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon
                    size={18}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {stat.detail}
                </p>
              </div>
            </Card>
          );
        })}

        <SystemHealthCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Collaboration checklist
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Core workspace flows are configured and ready for use.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              "Authenticated dashboard access",
              "Workspace and channel bootstrap",
              "Message history and composer",
              "Accessible navigation states",
              "Vercel deployment configuration",
              "Command palette workflow"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
              >
                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-950 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Rocket
              size={18}
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Recruiter demo path
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Show the whole product in under two minutes
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Start with workspace switching, create a channel, send a threaded message, run AI search, then open Settings to show profile and member management.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/workspace"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Open workspace
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Review settings
            </Link>
          </div>
        </Card>
      </div>

      <PortfolioShowcase />
    </section>
  );
}
