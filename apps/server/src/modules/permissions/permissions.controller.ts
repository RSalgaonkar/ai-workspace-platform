import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  evaluatePolicy,
  PermissionAction
} from "./policy.service";

export const evaluate = async (
  req: AuthRequest,
  res: Response
) => {
  const result =
    await evaluatePolicy({
      userId: req.user!.userId,
      workspaceId:
        req.body.workspaceId,
      channelId:
        req.body.channelId,
      action:
        req.body.action as PermissionAction,
      attributes:
        req.body.attributes
    });

  res.status(200).json({
    success: true,
    data: result
  });
};
