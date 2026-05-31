"use client";

import {
  useEffect,
  useState
} from "react";

import {
  getPresence,
  getAwareness,
  heartbeatPresence
} from "@/features/collaboration/api/collaboration.api";

type Presence = {
  userId: string;
  name: string;
  status: "online" | "away";
};

type Awareness = {
  typing: Presence[];
  idle: Presence[];
  graph: Array<{
    label: string;
    activeUsers: number;
  }>;
};

type Props = {
  workspaceId?: string | null;
};

export default function PresenceIndicators({
  workspaceId
}: Props) {
  const [people, setPeople] =
    useState<Presence[]>([]);
  const [awareness, setAwareness] =
    useState<Awareness | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    const sync = async () => {
      await heartbeatPresence(
        workspaceId
      );
      const response =
        await getPresence(
          workspaceId
        );
      setPeople(response.data);
      const awarenessResponse =
        await getAwareness(
          workspaceId
        );
      setAwareness(
        awarenessResponse.data
      );
    };

    sync();
    const interval =
      window.setInterval(
        sync,
        30000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [workspaceId]);

  if (!workspaceId) return null;

  return (
    <div
      className="hidden items-center gap-3 sm:flex"
      aria-label={`${people.length} active teammate${people.length === 1 ? "" : "s"}`}
      role="status"
      aria-live="polite"
    >
      <div className="-space-x-2">
        {people.slice(0, 4).map((person) => (
          <span
            key={person.userId}
            title={`${person.name} is ${person.status}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-xs font-semibold text-emerald-700"
            aria-label={`${person.name} is ${person.status}`}
          >
            {person.name
              .slice(0, 1)
              .toUpperCase()}
          </span>
        ))}
      </div>
      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
        {awareness?.typing.length ?? 0} typing - {awareness?.idle.length ?? 0} idle
      </span>
      {people.length === 0 && (
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
          Presence ready
        </span>
      )}
    </div>
  );
}
