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