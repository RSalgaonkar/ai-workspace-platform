import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  getDigest,
  getPreferences,
  updatePreferences
} from "./notification.service";

export const preferences = async (
  req: AuthRequest,
  res: Response
) => {
  const data =
    await getPreferences(
      req.user!.userId,
      typeof req.query.workspaceId ===
        "string"
        ? req.query.workspaceId
        : undefined
    );

  res.status(200).json({
    success: true,
    data
  });
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  const data =
    await updatePreferences(
      req.user!.userId,
      req.body
    );

  res.status(200).json({
    success: true,
    data
  });
};

export const digest = async (
  req: AuthRequest,
  res: Response
) => {
  const data =
    await getDigest(
      req.user!.userId,
      typeof req.query.workspaceId ===
        "string"
        ? req.query.workspaceId
        : undefined
    );

  res.status(200).json({
    success: true,
    data
  });
};
