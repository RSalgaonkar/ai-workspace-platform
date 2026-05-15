import jwt from "jsonwebtoken";

import { env } from "../config/env";

type TokenPayload = {
  userId: string;
  role: string;
};

export const generateAccessToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "15m"
  });
};

export const generateRefreshToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const verifyToken = (
  token: string
) => {
  return jwt.verify(token, env.JWT_SECRET);
};