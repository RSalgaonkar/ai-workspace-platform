import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  getActivityFeed
} from "./activity.service";

export const listActivity = async (
  req: AuthRequest,
  res: Response
) => {
  const workspaceId =
    typeof req.query.workspaceId ===
    "string"
      ? req.query.workspaceId
      : undefined;

  const feed =
    await getActivityFeed(
      workspaceId
    );

  res.status(200).json({
    success: true,
    data: feed
  });
};
