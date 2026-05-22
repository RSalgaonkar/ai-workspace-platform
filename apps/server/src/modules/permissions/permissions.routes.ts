import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  evaluate
} from "./permissions.controller";

const router = Router();

router.use(authenticate);

router.post("/evaluate", evaluate);

export default router;
