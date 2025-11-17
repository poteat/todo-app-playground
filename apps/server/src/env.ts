import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { z } from "zod";

const repoRootEnv = path.resolve(__dirname, "../../../.env");
if (fs.existsSync(repoRootEnv)) {
  dotenv.config({ path: repoRootEnv });
} else {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  CLIENT_ORIGIN: z.string().url(),
  FAULT_INJECTION_DELAY_MS: z.coerce.number().default(0),
  FAULT_INJECTION_FAILURE_RATE: z.coerce.number().min(0).max(1).default(0),
});

export const env = envSchema.parse(process.env);
