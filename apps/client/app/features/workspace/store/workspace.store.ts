import { create } from "zustand";

export type WorkspaceChannel = {
  id: string;
  name: string;
};

interface WorkspaceState {
  activeWorkspaceId:
    | string
    | null;

  activeWorkspaceName:
    | string
    | null;

  activeChannelId:
    | string
    | null;

  activeChannelName:
    | string
    | null;

  channels: WorkspaceChannel[];

  setWorkspace: (
    workspace: {
      id: string;
      name: string;
    }
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
    activeWorkspaceId: null,
    activeWorkspaceName: null,
    activeChannelId: null,
    activeChannelName: null,
    channels: [],

    setWorkspace: (
      workspace
    ) =>
      set({
        activeWorkspaceId:
          workspace.id,
        activeWorkspaceName:
          workspace.name
      }),

    setChannels: (
      channels
    ) =>
      set({
        channels
      }),

    setChannel: (
      channel
    ) =>
      set({
        activeChannelId:
          channel.id,
        activeChannelName:
          channel.name
      })
  }));
