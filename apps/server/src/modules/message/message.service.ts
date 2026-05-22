import prisma from "../../lib/prisma";

import {
  recordActivity
} from "../activity/activity.service";

import {
  indexEntity
} from "../search/indexer.service";

const findChannel =
  async (channelIdOrName: string) => {
    return prisma.channel.findFirst({
      where: {
        OR: [
          {
            id: channelIdOrName
          },
          {
            name: channelIdOrName
          }
        ]
      }
    });
  };

export const createMessage =
  async (
    channelIdOrName: string,
    userId: string,
    content: string,
    attachmentIds: string[] = [],
    parentId?: string
  ) => {
    const channel =
      await findChannel(
        channelIdOrName
      );

    if (!channel) {
      throw new Error(
        "Channel not found"
      );
    }

    const message =
      await prisma.message.create({
        data: {
          channelId: channel.id,
          userId,
          content,
          parentId,
          attachments: {
            create: attachmentIds.map(
              (fileId) => ({
                fileId
              })
            )
          }
        },

        include: {
          user: true,
          attachments: {
            include: {
              file: true
            }
          },
          reactions: true,
          replies: true
        }
      });

    await recordActivity({
      type: "MESSAGE_CREATED",
      title: parentId
        ? "Replied in a thread"
        : "Sent a message",
      actorId: userId,
      workspaceId:
        channel.workspaceId,
      metadata: {
        messageId: message.id,
        channelId: channel.id,
        attachmentCount:
          attachmentIds.length
      }
    });

    await indexEntity({
      workspaceId:
        channel.workspaceId,
      entityType: "MESSAGE",
      entityId: message.id,
      title: `Message in #${channel.name}`,
      body: message.content,
      metadata: {
        channelId: channel.id,
        userId
      }
    });

    return message;
  };

export const getMessages =
  async (channelIdOrName: string) => {
    const channel =
      await findChannel(
        channelIdOrName
      );

    if (!channel) {
      return [];
    }

    return prisma.message.findMany({
      where: {
        channelId: channel.id
      },

      include: {
        user: true,
        attachments: {
          include: {
            file: true
          }
        },
        reactions: true,
        replies: true
      },

      orderBy: {
        createdAt: "asc"
      }
    });
  };

export const getThreadMessages =
  async (messageId: string) => {
    const root =
      await prisma.message.findUnique({
        where: {
          id: messageId
        },
        include: {
          user: true,
          attachments: {
            include: {
              file: true
            }
          },
          reactions: true
        }
      });

    const replies =
      await prisma.message.findMany({
        where: {
          parentId: messageId
        },
        include: {
          user: true,
          attachments: {
            include: {
              file: true
            }
          },
          reactions: true
        },
        orderBy: {
          createdAt: "asc"
        }
      });

    return {
      root,
      replies
    };
  };

export const toggleReaction =
  async (
    messageId: string,
    userId: string,
    emoji: string
  ) => {
    const existing =
      await prisma.messageReaction.findUnique({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji
          }
        }
      });

    if (existing) {
      await prisma.messageReaction.delete({
        where: {
          id: existing.id
        }
      });

      return {
        removed: true
      };
    }

    const reaction =
      await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        }
      });

    await recordActivity({
      type: "REACTION_ADDED",
      title: `Reacted with ${emoji}`,
      actorId: userId,
      metadata: {
        messageId,
        emoji
      }
    });

    return {
      removed: false,
      reaction
    };
  };
