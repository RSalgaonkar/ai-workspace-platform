import api from "@/lib/axios";

export const getActivityFeed =
  async (workspaceId?: string | null) => {
    const response =
      await api.get("/activity", {
        params: {
          workspaceId
        }
      });

    return response.data;
  };

export const searchWorkspace =
  async (
    query: string,
    workspaceId?: string | null
  ) => {
    const response =
      await api.get("/search", {
        params: {
          q: query,
          workspaceId
        }
      });

    return response.data;
  };

export const askAssistant =
  async (data: {
    prompt: string;
    workspaceId?: string | null;
  }) => {
    const response =
      await api.post(
        "/ai/assistant",
        data
      );

    return response.data;
  };

export const createDocument =
  async (data: {
    workspaceId: string;
    title: string;
    content?: string;
  }) => {
    const response =
      await api.post(
        "/documents",
        data
      );

    return response.data;
  };

export const getDocuments =
  async (workspaceId: string) => {
    const response =
      await api.get(
        `/documents/workspace/${workspaceId}`
      );

    return response.data;
  };

export const heartbeatPresence =
  async (workspaceId: string) => {
    const response =
      await api.post(
        "/presence/heartbeat",
        {
          workspaceId,
          status: "online"
        }
      );

    return response.data;
  };

export const getPresence =
  async (workspaceId: string) => {
    const response =
      await api.get(
        `/presence/${workspaceId}`
      );

    return response.data;
  };

export const getAwareness =
  async (workspaceId: string) => {
    const response =
      await api.get(
        `/presence/${workspaceId}/awareness`
      );

    return response.data;
  };

export const updateNotificationPreferences =
  async (data: {
    workspaceId?: string | null;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    digestEnabled?: boolean;
    digestFrequency?: "DAILY" | "WEEKLY";
  }) => {
    const response =
      await api.patch(
        "/notifications/preferences",
        data
      );

    return response.data;
  };

export const getNotificationDigest =
  async (workspaceId?: string | null) => {
    const response =
      await api.get(
        "/notifications/digest",
        {
          params: {
            workspaceId
          }
        }
      );

    return response.data;
  };

export const getAnalytics =
  async (workspaceId: string) => {
    const response =
      await api.get(
        `/analytics/workspace/${workspaceId}`
      );

    return response.data;
  };
