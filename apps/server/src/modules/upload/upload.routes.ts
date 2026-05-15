import { Router } from "express";

import {
  authenticate
} from "../../middleware/auth.middleware";

import {
  uploadFile
} from "./upload.controller";

const router = Router();

router.use(authenticate);

router.post("/", uploadFile);

export default router;
