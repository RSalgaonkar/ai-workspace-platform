import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string().default("development"),
  CLIENT_ORIGIN: z
    .string()
    .default("http://localhost:3000")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");

  process.exit(1);
}

export const env = parsedEnv.data;
