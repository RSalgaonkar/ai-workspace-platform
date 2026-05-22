import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  analytics,
  changeMemberRole,
  create,
  createWorkspaceChannel,
  getMine,
  getOne,
  invite,
  reorderWorkspaceChannels,
  updateSettings
} from "./workspace.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);

router.get("/", getMine);

router.get("/:workspaceId", getOne);

router.patch("/:workspaceId", updateSettings);

router.get(
  "/:workspaceId/analytics",
  analytics
);

router.post(
  "/:workspaceId/channels",
  createWorkspaceChannel
);

router.patch(
  "/:workspaceId/channels/reorder",
  reorderWorkspaceChannels
);

router.post(
  "/:workspaceId/invites",
  invite
);

router.patch(
  "/:workspaceId/members/:memberId",
  changeMemberRole
);

export default router;
