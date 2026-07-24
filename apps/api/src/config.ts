import { z } from "zod";

const apiEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  HOST: z.string().trim().min(1).default("0.0.0.0"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().trim().min(1).default("http://localhost:5173,http://127.0.0.1:5173"),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  TRUST_PROXY: z.coerce.boolean().default(false)
});

const parsedEnvironment = apiEnvironmentSchema.parse(process.env);

export const apiConfig = {
  nodeEnv: parsedEnvironment.NODE_ENV,
  port: parsedEnvironment.PORT,
  host: parsedEnvironment.HOST,
  logLevel: parsedEnvironment.LOG_LEVEL,
  corsOrigins: parsedEnvironment.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
  rateLimitMax: parsedEnvironment.RATE_LIMIT_MAX,
  rateLimitTimeWindowMs: parsedEnvironment.RATE_LIMIT_TIME_WINDOW_MS,
  trustProxy: parsedEnvironment.TRUST_PROXY
} as const;