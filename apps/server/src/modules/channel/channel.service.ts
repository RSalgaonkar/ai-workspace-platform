import prisma from "../../lib/prisma";

export const getChannels =
  async (workspaceId: string) => {
    return prisma.channel.findMany({
      where: {
        workspaceId
      }
    });
  };