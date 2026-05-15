import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  heartbeat,
  list
} from "./presence.controller";

const router = Router();

router.use(authenticate);

router.post("/heartbeat", heartbeat);

router.get("/:workspaceId", list);

export default router;
