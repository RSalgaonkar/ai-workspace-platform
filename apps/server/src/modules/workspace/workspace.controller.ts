import { Response } from "express";

import {
  WorkspaceRole
} from "@prisma/client";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  createChannel,
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
  getWorkspaceAnalytics,
  inviteMember,
  reorderChannels,
  updateMemberRole,
  updateWorkspaceSettings
} from "./workspace.service";

import {
  createWorkspaceSchema
} from "./workspace.validation";

const getParam = (
  value: string | string[] | undefined
) => {
  if (!value || Array.isArray(value)) {
    throw new Error(
      "Invalid route parameter"
    );
  }

  return value;
};

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

export const getOne =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const workspace =
      await getWorkspace(
        getParam(req.params.workspaceId),
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data: workspace
    });
  };

export const updateSettings =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const workspace =
      await updateWorkspaceSettings(
        getParam(req.params.workspaceId),
        req.user!.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      data: workspace
    });
  };

export const createWorkspaceChannel =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const channel =
      await createChannel(
        getParam(req.params.workspaceId),
        req.user!.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: channel
    });
  };

export const reorderWorkspaceChannels =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const channels =
      await reorderChannels(
        getParam(req.params.workspaceId),
        req.user!.userId,
        req.body.channelIds ?? []
      );

    res.status(200).json({
      success: true,
      data: channels
    });
  };

export const invite =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const inviteRecord =
      await inviteMember(
        getParam(req.params.workspaceId),
        req.user!.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: inviteRecord
    });
  };

export const changeMemberRole =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const member =
      await updateMemberRole(
        getParam(req.params.workspaceId),
        req.user!.userId,
        getParam(req.params.memberId),
        req.body.role as WorkspaceRole
      );

    res.status(200).json({
      success: true,
      data: member
    });
  };

export const analytics =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const data =
      await getWorkspaceAnalytics(
        getParam(req.params.workspaceId),
        req.user!.userId
      );

    res.status(200).json({
      success: true,
      data
    });
  };
