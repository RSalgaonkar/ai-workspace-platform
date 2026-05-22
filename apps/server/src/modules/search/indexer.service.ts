import {
  SearchEntityType
} from "@prisma/client";

import prisma from "../../lib/prisma";

const tokenize = (text: string) =>
  Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
    )
  ).slice(0, 50);

export const indexEntity =
  async (data: {
    workspaceId: string;
    entityType: SearchEntityType;
    entityId: string;
    title: string;
    body: string;
    metadata?: object;
  }) => {
    return prisma.searchIndex.upsert({
      where: {
        workspaceId_entityType_entityId: {
          workspaceId:
            data.workspaceId,
          entityType:
            data.entityType,
          entityId:
            data.entityId
        }
      },
      update: {
        title: data.title,
        body: data.body,
        keywords: tokenize(
          `${data.title} ${data.body}`
        ),
        metadata: data.metadata
      },
      create: {
        workspaceId:
          data.workspaceId,
        entityType:
          data.entityType,
        entityId: data.entityId,
        title: data.title,
        body: data.body,
        keywords: tokenize(
          `${data.title} ${data.body}`
        ),
        embedding: {
          provider: "placeholder",
          dimensions: 0
        },
        metadata: data.metadata
      }
    });
  };
