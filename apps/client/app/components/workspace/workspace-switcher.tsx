"use client";

import { useEffect } from "react";

import {
  Building2,
  ChevronDown,
  Loader2
} from "lucide-react";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

import {
  createWorkspace,
  getWorkspaces
} from "@/features/workspace/api/workspace.api";

type Workspace = {
  id: string;
  name: string;
  channels?: Array<{
    id: string;
    name: string;
  }>;
};

export default function WorkspaceSwitcher() {
  const activeWorkspaceId =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceId
    );

  const activeWorkspaceName =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceName
    );

  const activeChannelId =
    useWorkspaceStore(
      (state) =>
        state.activeChannelId
    );

  const setWorkspace =
    useWorkspaceStore(
      (state) =>
        state.setWorkspace
    );

  const setChannels =
    useWorkspaceStore(
      (state) =>
        state.setChannels
    );

  const setChannel =
    useWorkspaceStore(
      (state) =>
        state.setChannel
    );

  useEffect(() => {
    const load =
      async () => {
        let response =
          await getWorkspaces();

        let workspaces =
          response.data as Workspace[];

        if (workspaces.length === 0) {
          await createWorkspace({
            name: "My Workspace"
          });

          response =
            await getWorkspaces();

          workspaces =
            response.data as Workspace[];
        }

        if (
          workspaces.length > 0 &&
          !activeWorkspaceId
        ) {
          const workspace =
            workspaces[0];

          setWorkspace({
            id: workspace.id,
            name: workspace.name
          });

          setChannels(
            workspace.channels ?? []
          );

          if (
            workspace.channels?.[0] &&
            !activeChannelId
          ) {
            setChannel(
              workspace.channels[0]
            );
          }
        }
      };

    load();
  }, [
    activeChannelId,
    activeWorkspaceId,
    setChannels,
    setChannel,
    setWorkspace
  ]);

  return (
    <button
      type="button"
      className="group flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm outline-none transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-900"
      aria-label="Current workspace"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
        {activeWorkspaceName ? (
          <Building2 size={17} />
        ) : (
          <Loader2
            size={17}
            className="animate-spin"
          />
        )}
      </span>

      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
          Workspace
        </span>
        <span className="block truncate text-sm font-semibold text-slate-950">
          {activeWorkspaceName ??
            "Preparing workspace"}
        </span>
      </span>

      <ChevronDown
        size={16}
        className="ml-2 text-slate-400 transition group-hover:text-slate-600"
        aria-hidden="true"
      />
    </button>
  );
}
