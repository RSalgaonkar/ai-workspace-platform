import { Response } from "express";

import prisma from "../../lib/prisma";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

export const search = async (
  req: AuthRequest,
  res: Response
) => {
  const query =
    typeof req.query.q === "string"
      ? req.query.q.trim()
      : "";

  if (!query) {
    res.status(200).json({
      success: true,
      data: {
        messages: [],
        documents: [],
        workspaces: []
      }
    });

    return;
  }

  const [
    messages,
    documents,
    workspaces
  ] = await Promise.all([
    prisma.message.findMany({
      where: {
        content: {
          contains: query,
          mode: "insensitive"
        }
      },
      include: {
        user: true,
        channel: true
      },
      take: 10
    }),
    prisma.collaborativeDocument.findMany({
      where: {
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
        name: {
          contains: query,
          mode: "insensitive"
        }
      },
      take: 10
    })
  ]);

  res.status(200).json({
    success: true,
    data: {
      messages,
      documents,
      workspaces
    }
  });
};
