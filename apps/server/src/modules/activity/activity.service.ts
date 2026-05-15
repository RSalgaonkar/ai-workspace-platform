import {
  Prisma
} from "@prisma/client";

import prisma from "../../lib/prisma";

export const recordActivity = async (data: {
  type:
    | "MESSAGE_CREATED"
    | "FILE_UPLOADED"
    | "REACTION_ADDED"
    | "DOCUMENT_UPDATED"
    | "WORKSPACE_UPDATED"
    | "AI_ASSISTANT_USED";
  title: string;
  actorId?: string;
  workspaceId?: string;
  metadata?: Prisma.InputJsonValue;
}) => {
  return prisma.activity.create({
    data: {
      type: data.type,
      title: data.title,
      actorId: data.actorId,
      workspaceId: data.workspaceId,
      metadata: data.metadata
    }
  });
};

export const getActivityFeed = async (
  workspaceId?: string
) => {
  return prisma.activity.findMany({
    where: {
      workspaceId
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });
};
