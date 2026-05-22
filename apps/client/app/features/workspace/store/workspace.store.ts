import { create } from "zustand";

export type WorkspaceChannel = {
  id: string;
  name: string;
  description?: string | null;
  position?: number;
};

export type WorkspaceMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type WorkspaceInvite = {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: string;
  expiresAt: string;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatarUrl?: string | null;
  avatarColor?: string;
  settings?: Record<string, unknown> | null;
  channels?: WorkspaceChannel[];
  members?: WorkspaceMember[];
  invites?: WorkspaceInvite[];
};

interface WorkspaceState {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId:
    | string
    | null;
  activeWorkspace:
    | WorkspaceSummary
    | null;
  activeChannelId:
    | string
    | null;
  activeChannelName:
    | string
    | null;
  channels: WorkspaceChannel[];
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  setWorkspaces: (
    workspaces: WorkspaceSummary[]
  ) => void;
  setWorkspace: (
    workspace: WorkspaceSummary
  ) => void;
  setChannels: (
    channels: WorkspaceChannel[]
  ) => void;
  setChannel: (
    channel: WorkspaceChannel
  ) => void;
}

export const useWorkspaceStore =
  create<WorkspaceState>((set) => ({
    workspaces: [],
    activeWorkspaceId: null,
    activeWorkspace: null,
    activeChannelId: null,
    activeChannelName: null,
    channels: [],
    members: [],
    invites: [],

    setWorkspaces: (workspaces) =>
      set({
        workspaces
      }),

    setWorkspace: (workspace) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "activeWorkspaceId",
          workspace.id
        );
      }

      const channels =
        workspace.channels ?? [];

      set({
        activeWorkspaceId:
          workspace.id,
        activeWorkspace: workspace,
        channels,
        members:
          workspace.members ?? [],
        invites:
          workspace.invites ?? [],
        activeChannelId:
          channels[0]?.id ?? null,
        activeChannelName:
          channels[0]?.name ?? null
      });
    },

    setChannels: (channels) =>
      set({
        channels
      }),

    setChannel: (channel) =>
      set({
        activeChannelId:
          channel.id,
        activeChannelName:
          channel.name
      })
  }));
