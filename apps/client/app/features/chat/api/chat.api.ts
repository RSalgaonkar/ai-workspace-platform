import api from "@/lib/axios";

export const getMessages =
  async (channelId: string) => {
    const response =
      await api.get(
        `/messages/${channelId}`
      );

    return response.data;
  };

export const sendMessage =
  async (data: {
    channelId: string;
    content: string;
    attachmentIds?: string[];
    parentId?: string;
  }) => {
    const response =
      await api.post("/messages", {
        channelId: data.channelId,
        content: data.content,
        attachmentIds:
          data.attachmentIds,
        parentId: data.parentId
      });

    return response.data;
  };

export const reactToMessage =
  async (
    messageId: string,
    emoji: string
  ) => {
    const response =
      await api.post(
        `/messages/${messageId}/reactions`,
        {
          emoji
        }
      );

    return response.data;
  };

export const getThread =
  async (messageId: string) => {
    const response =
      await api.get(
        `/messages/${messageId}/thread/replies`
      );

    return response.data;
  };
