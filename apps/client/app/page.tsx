import Link from "next/link";

import {
  Bot,
  Layers3,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";

const features = [
  {
    title: "Multi-workspace collaboration",
    description:
      "Create and switch between tenant-isolated team spaces with roles, members, and channels.",
    icon: Layers3
  },
  {
    title: "Production chat workflows",
    description:
      "Threaded messages, attachments, reactions, activity, and presence in one focused workspace.",
    icon: MessageSquare
  },
  {
    title: "AI workspace assistant",
    description:
      "Summarize work, draft updates, and turn collaboration signals into action.",
    icon: Bot
  }
];

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-slate-950 text-white"
    >
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <nav
          className="flex items-center justify-between"
          aria-label="Primary"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-950">
              <Sparkles
                size={18}
                aria-hidden="true"
              />
            </span>
            <span className="text-lg font-bold">
              AI Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <ShieldCheck
                size={16}
                aria-hidden="true"
              />
              Multi-tenant portfolio-grade collaboration platform
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight tracking-normal md:text-6xl">
              AI Workspace Platform
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A full-stack collaboration suite with workspaces, channels, members, permissions, invitations, AI assistance, activity intelligence, and production deployment foundations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Create workspace
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-2xl">
            <div className="rounded-lg bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Workspace analytics
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Product Team
                  </h2>
                </div>
                <Users
                  className="text-slate-500"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["12", "Members"],
                  ["8", "Channels"],
                  ["246", "Messages"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-slate-100 p-3"
                  >
                    <p className="text-2xl font-bold">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <Icon
                        className="mt-0.5 text-slate-500"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold">
                          {feature.title}
                        </p>
                        <p className="text-sm leading-6 text-slate-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
