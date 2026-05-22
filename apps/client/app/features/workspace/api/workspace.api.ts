import api from "@/lib/axios";

export const getWorkspaces =
  async () => {
    const response =
      await api.get("/workspaces");

    return response.data;
  };

export const createWorkspace =
  async (data: {
    name: string;
    description?: string;
  }) => {
    const response =
      await api.post(
        "/workspaces",
        data
      );

    return response.data;
  };

export const updateWorkspace =
  async (
    workspaceId: string,
    data: {
      name?: string;
      description?: string;
      avatarColor?: string;
      settings?: Record<string, unknown>;
    }
  ) => {
    const response =
      await api.patch(
        `/workspaces/${workspaceId}`,
        data
      );

    return response.data;
  };

export const createChannel =
  async (
    workspaceId: string,
    data: {
      name: string;
      description?: string;
    }
  ) => {
    const response =
      await api.post(
        `/workspaces/${workspaceId}/channels`,
        data
      );

    return response.data;
  };

export const reorderChannels =
  async (
    workspaceId: string,
    channelIds: string[]
  ) => {
    const response =
      await api.patch(
        `/workspaces/${workspaceId}/channels/reorder`,
        {
          channelIds
        }
      );

    return response.data;
  };

export const inviteMember =
  async (
    workspaceId: string,
    data: {
      email: string;
      role: "ADMIN" | "MEMBER";
    }
  ) => {
    const response =
      await api.post(
        `/workspaces/${workspaceId}/invites`,
        data
      );

    return response.data;
  };

export const updateMemberRole =
  async (
    workspaceId: string,
    memberId: string,
    role: "OWNER" | "ADMIN" | "MEMBER"
  ) => {
    const response =
      await api.patch(
        `/workspaces/${workspaceId}/members/${memberId}`,
        {
          role
        }
      );

    return response.data;
  };

export const getWorkspaceAnalytics =
  async (workspaceId: string) => {
    const response =
      await api.get(
        `/workspaces/${workspaceId}/analytics`
      );

    return response.data;
  };
