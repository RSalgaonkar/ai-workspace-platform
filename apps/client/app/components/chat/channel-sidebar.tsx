"use client";

import {
  useState
} from "react";

import {
  GripVertical,
  Hash,
  Plus
} from "lucide-react";

import {
  createChannel,
  reorderChannels
} from "@/features/workspace/api/workspace.api";

import {
  useWorkspaceStore,
  WorkspaceChannel
} from "@/features/workspace/store/workspace.store";

export default function ChannelSidebar() {
  const [isCreating, setIsCreating] =
    useState(false);
  const [channelName, setChannelName] =
    useState("");
  const [draggedId, setDraggedId] =
    useState<string | null>(null);

  const activeWorkspaceId =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceId
    );
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
  const setChannels =
    useWorkspaceStore(
      (state) => state.setChannels
    );

  const createNewChannel =
    async () => {
      if (
        !activeWorkspaceId ||
        !channelName.trim()
      )
        return;

      const response =
        await createChannel(
          activeWorkspaceId,
          {
            name: channelName
          }
        );

      const channel =
        response.data as WorkspaceChannel;

      setChannels([
        ...channels,
        channel
      ]);
      setChannel(channel);
      setChannelName("");
      setIsCreating(false);
    };

  const moveChannel =
    async (targetId: string) => {
      if (
        !draggedId ||
        draggedId === targetId ||
        !activeWorkspaceId
      )
        return;

      const from =
        channels.findIndex(
          (channel) =>
            channel.id === draggedId
        );
      const to =
        channels.findIndex(
          (channel) =>
            channel.id === targetId
        );

      if (from < 0 || to < 0) return;

      const next = [...channels];
      const [moved] = next.splice(
        from,
        1
      );
      next.splice(to, 0, moved);
      setChannels(next);

      await reorderChannels(
        activeWorkspaceId,
        next.map((channel) => channel.id)
      );
    };

  const moveChannelByOffset =
    async (
      channelId: string,
      offset: number
    ) => {
      if (!activeWorkspaceId) return;

      const from =
        channels.findIndex(
          (channel) =>
            channel.id === channelId
        );
      const to = from + offset;

      if (
        from < 0 ||
        to < 0 ||
        to >= channels.length
      )
        return;

      const next = [...channels];
      const [moved] = next.splice(
        from,
        1
      );
      next.splice(to, 0, moved);
      setChannels(next);

      await reorderChannels(
        activeWorkspaceId,
        next.map((channel) => channel.id)
      );
    };

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
          onClick={() =>
            setIsCreating((value) => !value)
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          aria-label="Create channel"
        >
          <Plus size={16} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <label
            htmlFor="channel-name"
            className="sr-only"
          >
            Channel name
          </label>
          <input
            id="channel-name"
            value={channelName}
            onChange={(event) =>
              setChannelName(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createNewChannel();
              }
            }}
            placeholder="channel-name"
            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            aria-describedby="channel-create-help"
          />
          <p
            id="channel-create-help"
            className="mt-2 text-xs text-slate-500"
          >
            Press Enter to create this channel.
          </p>
        </div>
      )}

      <p
        id="channel-reorder-help"
        className="sr-only"
      >
        Channel buttons can be dragged with a mouse. Keyboard users can use the move up and move down buttons next to each channel.
      </p>

      <div
        className="space-y-2"
        role="list"
        aria-describedby="channel-reorder-help"
      >
        {channels.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
            Channels will appear once your workspace is ready.
          </div>
        ) : (
          channels.map((channel, index) => {
            const isActive =
              channel.id ===
              activeChannelId;

            return (
              <div
                key={channel.id}
                draggable
                onDragStart={() =>
                  setDraggedId(channel.id)
                }
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={() =>
                  moveChannel(channel.id)
                }
                className={`group flex w-full items-center gap-1 rounded-lg p-1 transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
                role="listitem"
              >
                <button
                  type="button"
                  onClick={() =>
                    setChannel(channel)
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md p-1 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  aria-label={`Open ${channel.name} channel`}
                >
                  <GripVertical
                    size={14}
                    className="shrink-0 opacity-50"
                    aria-hidden="true"
                  />
                  <Hash
                    size={16}
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {channel.name}
                  </span>
                </button>

                <div className="flex shrink-0 gap-1 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() =>
                      moveChannelByOffset(
                        channel.id,
                        -1
                      )
                    }
                    disabled={index === 0}
                    className="rounded-md px-1.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-40"
                    aria-label={`Move ${channel.name} up`}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      moveChannelByOffset(
                        channel.id,
                        1
                      )
                    }
                    disabled={
                      index ===
                      channels.length - 1
                    }
                    className="rounded-md px-1.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-40"
                    aria-label={`Move ${channel.name} down`}
                  >
                    Down
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
