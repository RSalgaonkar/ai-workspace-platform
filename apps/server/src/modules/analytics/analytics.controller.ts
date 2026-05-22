import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  getWorkspaceAnalytics
} from "./analytics.service";

export const workspaceAnalytics =
  async (
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

    const data =
      await getWorkspaceAnalytics(
        workspaceId
      );

    res.status(200).json({
      success: true,
      data
    });
  };
