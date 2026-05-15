import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  create,
  listByChannel,
  react,
  thread
} from "./message.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/:messageId/thread/replies",
  thread
);

router.post(
  "/:messageId/reactions",
  react
);

router.get("/:channelId", listByChannel);

router.post("/", create);

export default router;
