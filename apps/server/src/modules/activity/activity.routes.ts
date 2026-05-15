import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  listActivity
} from "./activity.controller";

const router = Router();

router.use(authenticate);

router.get("/", listActivity);

export default router;
