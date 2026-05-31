"use client";

import {
  useEffect,
  useCallback,
  useState
} from "react";

import {
  ChevronDown,
  Loader2,
  Plus
} from "lucide-react";

import {
  createWorkspace,
  getWorkspaces
} from "@/features/workspace/api/workspace.api";

import {
  useWorkspaceStore,
  WorkspaceSummary
} from "@/features/workspace/store/workspace.store";

export default function WorkspaceSwitcher() {
  const menuId = "workspace-switcher-menu";

  const [isOpen, setIsOpen] =
    useState(false);
  const [isCreating, setIsCreating] =
    useState(false);

  const workspaces =
    useWorkspaceStore(
      (state) => state.workspaces
    );

  const activeWorkspace =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspace
    );

  const setWorkspaces =
    useWorkspaceStore(
      (state) =>
        state.setWorkspaces
    );

  const setWorkspace =
    useWorkspaceStore(
      (state) =>
        state.setWorkspace
    );

  const refresh = useCallback(async () => {
    let response =
      await getWorkspaces();

    let loaded =
      response.data as WorkspaceSummary[];

    if (loaded.length === 0) {
      await createWorkspace({
        name: "My Workspace",
        description:
          "Your default collaboration hub"
      });

      response =
        await getWorkspaces();
      loaded =
        response.data as WorkspaceSummary[];
    }

    setWorkspaces(loaded);

    const persisted =
      typeof window !== "undefined"
        ? localStorage.getItem(
            "activeWorkspaceId"
          )
        : null;

    const selected =
      loaded.find(
        (workspace) =>
          workspace.id === persisted
      ) ?? loaded[0];

    if (selected) {
      setWorkspace(selected);
    }
  }, [
    setWorkspace,
    setWorkspaces
  ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNewWorkspace =
    async () => {
      setIsCreating(true);
      try {
        const response =
          await createWorkspace({
            name: `Workspace ${
              workspaces.length + 1
            }`,
            description:
              "New collaborative workspace"
          });

        const next =
          response.data as WorkspaceSummary;

        setWorkspaces([
          next,
          ...workspaces
        ]);
        setWorkspace(next);
        setIsOpen(false);
      } finally {
        setIsCreating(false);
      }
    };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setIsOpen((value) => !value)
        }
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className="group flex min-w-64 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm outline-none transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-900"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
          style={{
            backgroundColor:
              activeWorkspace?.avatarColor ??
              "#0f172a"
          }}
        >
          {activeWorkspace ? (
            activeWorkspace.name
              .slice(0, 1)
              .toUpperCase()
          ) : (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Workspace
          </span>
          <span className="block truncate text-sm font-semibold text-slate-950">
            {activeWorkspace?.name ??
              "Preparing workspace"}
          </span>
        </span>

        <ChevronDown
          size={16}
          className="text-slate-400"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Available workspaces"
          className="absolute left-0 top-12 z-30 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-xl"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
        >
          <div className="max-h-72 overflow-y-auto">
            {workspaces.map(
              (workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => {
                    setWorkspace(workspace);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  role="menuitem"
                  aria-current={
                    workspace.id ===
                    activeWorkspace?.id
                      ? "true"
                      : undefined
                  }
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white"
                    style={{
                      backgroundColor:
                        workspace.avatarColor ??
                        "#0f172a"
                    }}
                  >
                    {workspace.name
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">
                      {workspace.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {workspace.members
                        ?.length ?? 0}{" "}
                      members
                    </span>
                  </span>
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={
              createNewWorkspace
            }
            disabled={isCreating}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-50"
            role="menuitem"
            aria-busy={isCreating}
          >
            {isCreating ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Plus size={16} />
            )}
            Create workspace
          </button>
        </div>
      )}
    </div>
  );
}
