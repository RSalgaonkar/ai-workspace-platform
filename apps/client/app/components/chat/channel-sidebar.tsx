"use client";

import {
  Hash,
  Plus
} from "lucide-react";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

export default function ChannelSidebar() {
  const channels =
    useWorkspaceStore(
      (state) => state.channels
    );

  const activeChannelId =
    useWorkspaceStore(
      (state) =>
        state.activeChannelId
    );

  const setChannel =
    useWorkspaceStore(
      (state) => state.setChannel
    );

  return (
    <aside
      className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 text-slate-900"
      aria-label="Workspace channels"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Channels
          </p>
          <h2 className="text-lg font-bold text-slate-950">
            Team spaces
          </h2>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          aria-label="Create channel"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {channels.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
            Channels will appear once your workspace is ready.
          </div>
        ) : (
          channels.map((channel) => {
            const isActive =
              channel.id ===
              activeChannelId;

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() =>
                  setChannel(channel)
                }
                className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
              >
                <Hash
                  size={16}
                  aria-hidden="true"
                />

                <span className="truncate">
                  {channel.name}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
