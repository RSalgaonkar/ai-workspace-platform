import { Response } from "express";

import prisma from "../../lib/prisma";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  listPresence,
  updatePresence
} from "./presence.service";

export const heartbeat = async (
  req: AuthRequest,
  res: Response
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: req.user!.userId
      },
      select: {
        id: true,
        name: true
      }
    });

  if (!user) {
    res.status(404).json({
      success: false
    });

    return;
  }

  const record =
    updatePresence({
      userId: user.id,
      name: user.name,
      workspaceId:
        req.body.workspaceId,
      status:
        req.body.status ?? "online",
      lastSeenAt:
        new Date().toISOString()
    });

  res.status(200).json({
    success: true,
    data: record
  });
};

export const list = (
  req: AuthRequest,
  res: Response
) => {
  const { workspaceId } = req.params;

  if (
    !workspaceId ||
    Array.isArray(workspaceId)
  ) {
    res.status(400).json({
      success: false,
      message:
        "Workspace id is required"
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: listPresence(
      workspaceId
    )
  });
};
