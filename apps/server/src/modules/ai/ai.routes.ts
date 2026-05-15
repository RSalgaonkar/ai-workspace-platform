import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  assistant
} from "./ai.controller";

const router = Router();

router.use(authenticate);

router.post("/assistant", assistant);

export default router;
