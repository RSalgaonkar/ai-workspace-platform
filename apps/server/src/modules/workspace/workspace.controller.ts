import {
  Request,
  Response
} from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  createWorkspace,
  getUserWorkspaces
} from "./workspace.service";

import {
  createWorkspaceSchema
} from "./workspace.validation";

export const create =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const validated =
        createWorkspaceSchema.parse(
          req.body
        );

      const workspace =
        await createWorkspace(
          req.user!.userId,
          validated
        );

      res.status(201).json({
        success: true,
        data: workspace
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      });
    }
  };

export const getMine =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const workspaces =
        await getUserWorkspaces(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: workspaces
      });
    } catch (error) {
      res.status(400).json({
        success: false
      });
    }
  };