import prisma from "../../lib/prisma";

import {
  recordActivity
} from "../activity/activity.service";

export const createDocument = async (data: {
  workspaceId: string;
  title: string;
  content?: string;
  authorId: string;
}) => {
  const document =
    await prisma.collaborativeDocument.create({
      data: {
        workspaceId: data.workspaceId,
        title: data.title,
        content: data.content ?? "",
        revisions: {
          create: {
            version: 1,
            content: data.content ?? "",
            authorId: data.authorId
          }
        }
      },
      include: {
        revisions: true
      }
    });

  await recordActivity({
    type: "DOCUMENT_UPDATED",
    title: `Created ${data.title}`,
    actorId: data.authorId,
    workspaceId: data.workspaceId,
    metadata: {
      documentId: document.id
    }
  });

  return document;
};

export const listDocuments = async (
  workspaceId: string
) => {
  return prisma.collaborativeDocument.findMany({
    where: {
      workspaceId
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
};

export const updateDocument = async (data: {
  documentId: string;
  content: string;
  authorId: string;
}) => {
  const latest =
    await prisma.documentRevision.findFirst({
      where: {
        documentId: data.documentId
      },
      orderBy: {
        version: "desc"
      }
    });

  const version =
    (latest?.version ?? 0) + 1;

  const document =
    await prisma.collaborativeDocument.update({
      where: {
        id: data.documentId
      },
      data: {
        content: data.content,
        revisions: {
          create: {
            version,
            content: data.content,
            authorId: data.authorId
          }
        }
      },
      include: {
        revisions: {
          orderBy: {
            version: "desc"
          },
          take: 5
        }
      }
    });

  await recordActivity({
    type: "DOCUMENT_UPDATED",
    title: `Updated ${document.title}`,
    actorId: data.authorId,
    workspaceId: document.workspaceId,
    metadata: {
      documentId: document.id,
      version
    }
  });

  return document;
};
