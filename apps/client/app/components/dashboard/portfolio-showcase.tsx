import {
  BrainCircuit,
  CheckCircle2,
  Database,
  GitBranch,
  LockKeyhole,
  Rocket,
  Search,
  ShieldCheck,
  Workflow,
  Zap
} from "lucide-react";

import Card from "@/components/ui/card";

const maturityItems = [
  {
    area: "Authentication",
    level: "Production",
    detail:
      "JWT access tokens, refresh cookies, route protection",
    icon: ShieldCheck
  },
  {
    area: "Collaboration",
    level: "Advanced",
    detail:
      "Workspaces, members, channels, chat, reactions, threads",
    icon: Workflow
  },
  {
    area: "AI/Search",
    level: "Portfolio",
    detail:
      "Assistant panel, hybrid search, ranking UI, indexing model",
    icon: BrainCircuit
  },
  {
    area: "Permissions",
    level: "Enterprise",
    detail:
      "RBAC, custom roles, policy layer, channel permissions",
    icon: LockKeyhole
  }
];

const deploymentItems = [
  "Vercel client configuration",
  "External API origin support",
  "Production cookie policy",
  "Socket origin configuration",
  "Client lint and build verified"
];

const architectureItems = [
  {
    title: "Multi-tenant data model",
    description:
      "Workspace ownership, memberships, invites, roles, channels, and resources are isolated by tenant.",
    icon: Database
  },
  {
    title: "Realtime collaboration layer",
    description:
      "Socket.IO powers workspace events, chat updates, presence, and future awareness signals.",
    icon: Zap
  },
  {
    title: "Search and intelligence foundation",
    description:
      "Search index entities support messages, documents, files, workspace metadata, and AI ranking.",
    icon: Search
  },
  {
    title: "Delivery pipeline ready",
    description:
      "Monorepo builds, Vercel frontend deployment, and separate Node API hosting are documented.",
    icon: GitBranch
  }
];

export default function PortfolioShowcase() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Rocket
              size={18}
              className="text-slate-500"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-slate-950">
              Feature maturity matrix
            </h2>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {maturityItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.area}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon
                        size={17}
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-950">
                          {item.area}
                        </h3>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {item.level}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Deployment readiness
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Clear production signals make the project easier to evaluate and deploy.
          </p>

          <ul className="mt-4 space-y-2">
            {deploymentItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-700"
              >
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">
          Architecture highlights
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {architectureItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg bg-slate-50 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                  <Icon
                    size={17}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
