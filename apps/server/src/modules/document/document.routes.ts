import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  create,
  list,
  update
} from "./document.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/workspace/:workspaceId",
  list
);

router.post("/", create);

router.patch("/:documentId", update);

export default router;
