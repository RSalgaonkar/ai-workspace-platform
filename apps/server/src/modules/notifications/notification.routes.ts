import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  digest,
  preferences,
  update
} from "./notification.controller";

const router = Router();

router.use(authenticate);

router.get("/preferences", preferences);

router.patch("/preferences", update);

router.get("/digest", digest);

export default router;
