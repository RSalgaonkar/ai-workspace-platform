import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  workspaceAnalytics
} from "./analytics.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/workspace/:workspaceId",
  workspaceAnalytics
);

export default router;
