"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Activity
} from "lucide-react";

import {
  getActivityFeed
} from "@/features/collaboration/api/collaboration.api";

type ActivityItem = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  actor?: {
    name: string;
  } | null;
};

type Props = {
  workspaceId?: string | null;
};

export default function ActivityFeed({
  workspaceId
}: Props) {
  const [items, setItems] =
    useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!workspaceId) return;

    getActivityFeed(workspaceId)
      .then((response) =>
        setItems(response.data)
      )
      .catch(() => setItems([]));
  }, [workspaceId]);

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4"
      aria-labelledby="activity-title"
    >
      <div className="flex items-center gap-2">
        <Activity
          size={17}
          className="text-slate-500"
          aria-hidden="true"
        />
        <h2
          id="activity-title"
          className="text-sm font-semibold text-slate-950"
        >
          Activity
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm leading-6 text-slate-500">
            New uploads, document edits, reactions, and messages will appear here.
          </p>
        ) : (
          items.slice(0, 5).map((item) => (
            <article
              key={item.id}
              className="rounded-lg bg-slate-50 p-3"
            >
              <p className="text-sm font-medium text-slate-800">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.actor?.name ??
                  "System"}{" "}
                ·{" "}
                {new Date(
                  item.createdAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
