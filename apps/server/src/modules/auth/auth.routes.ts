import { Router } from "express";

import {
  currentUser,
  login,
  logout,
  refresh,
  register
} from "./auth.controller";

import {
  authenticate
} from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post(
  "/logout",
  authenticate,
  logout
);

router.get(
  "/me",
  authenticate,
  currentUser
);

export default router;