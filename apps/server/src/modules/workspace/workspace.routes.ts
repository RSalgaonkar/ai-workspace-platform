import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  create,
  getMine
} from "./workspace.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);

router.get("/", getMine);

export default router;