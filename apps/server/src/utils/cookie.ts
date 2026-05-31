import { CookieOptions } from "express";

import { env } from "../config/env";

const isProduction =
  env.NODE_ENV === "production";

export const refreshTokenCookieOptions: CookieOptions =
  {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
