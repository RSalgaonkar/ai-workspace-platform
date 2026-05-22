import { Response } from "express";

import prisma from "../../lib/prisma";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

const scoreResult = (
  query: string,
  text: string
) => {
  const q =
    query.toLowerCase();
  const body =
    text.toLowerCase();

  if (body === q) return 100;
  if (body.includes(q)) return 80;

  const tokens = q.split(/\s+/);
  return tokens.reduce(
    (score, token) =>
      body.includes(token)
        ? score + 15
        : score,
    0
  );
};

export const search = async (
  req: AuthRequest,
  res: Response
) => {
  const query =
    typeof req.query.q === "string"
      ? req.query.q.trim()
      : "";
  const workspaceId =
    typeof req.query.workspaceId ===
    "string"
      ? req.query.workspaceId
      : undefined;

  if (!query) {
    res.status(200).json({
      success: true,
      data: {
        results: [],
        messages: [],
        documents: [],
        workspaces: [],
        attachments: []
      }
    });

    return;
  }

  const [
    indexed,
    messages,
    documents,
    workspaces,
    attachments
  ] = await Promise.all([
    prisma.searchIndex.findMany({
      where: {
        workspaceId,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            body: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            keywords: {
              hasSome: query
                .toLowerCase()
                .split(/\s+/)
            }
          }
        ]
      },
      take: 20
    }),
    prisma.message.findMany({
      where: {
        channel: {
          workspaceId
        },
        content: {
          contains: query,
          mode: "insensitive"
        }
      },
      include: {
        user: true,
        channel: true,
        attachments: {
          include: {
            file: true
          }
        }
      },
      take: 10
    }),
    prisma.collaborativeDocument.findMany({
      where: {
        workspaceId,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            content: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      },
      take: 10
    }),
    prisma.workspace.findMany({
      where: {
        id: workspaceId,
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 10
    }),
    prisma.fileAsset.findMany({
      where: {
        workspaceId,
        fileName: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 10
    })
  ]);

  const results = [
    ...indexed.map((item) => ({
      id: item.id,
      type: item.entityType,
      title: item.title,
      snippet: item.body.slice(0, 180),
      score: scoreResult(
        query,
        `${item.title} ${item.body}`
      ) + 10
    })),
    ...messages.map((item) => ({
      id: item.id,
      type: "MESSAGE",
      title: `Message by ${item.user.name}`,
      snippet: item.content,
      score: scoreResult(
        query,
        item.content
      )
    })),
    ...documents.map((item) => ({
      id: item.id,
      type: "DOCUMENT",
      title: item.title,
      snippet: item.content.slice(0, 180),
      score: scoreResult(
        query,
        `${item.title} ${item.content}`
      )
    })),
    ...attachments.map((item) => ({
      id: item.id,
      type: "FILE",
      title: item.fileName,
      snippet: item.mimeType,
      score: scoreResult(
        query,
        item.fileName
      )
    }))
  ].sort((a, b) => b.score - a.score);

  res.status(200).json({
    success: true,
    data: {
      results,
      messages,
      documents,
      workspaces,
      attachments,
      ranking: "hybrid-fuzzy-keyword"
    }
  });
};
