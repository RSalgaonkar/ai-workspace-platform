import {
  Bell,
  Lock,
  UserRound
} from "lucide-react";

import Card from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Workspace preferences
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Manage account, notification, and security preferences for your collaboration space.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Profile",
            description:
              "Keep your display name and team identity up to date.",
            icon: UserRound
          },
          {
            title: "Notifications",
            description:
              "Choose which workspace events need your attention.",
            icon: Bell
          },
          {
            title: "Security",
            description:
              "Review authentication and workspace access controls.",
            icon: Lock
          }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Icon
                  size={19}
                  aria-hidden="true"
                />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
