import { env } from "./env";

export const allowedOrigins = env.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isAllowedOrigin = (
  origin?: string
) => {
  if (!origin) return true;

  return allowedOrigins.includes(origin);
};
