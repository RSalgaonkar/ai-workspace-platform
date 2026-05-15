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
  async (query: string) => {
    const response =
      await api.get("/search", {
        params: {
          q: query
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
