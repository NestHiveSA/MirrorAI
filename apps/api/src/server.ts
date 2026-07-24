import Fastify, { type FastifyBaseLogger } from "fastify";
import { ZodError } from "zod";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import {
  AnalysisResultSchema,
  AnalysisRequestSchema,
  type ErrorCode,
  type ErrorResponse
} from "@mirrorai/shared";
import { apiConfig } from "./config.js";
import { AnalysisService } from "./services/analysis-service.js";

const analysisService = new AnalysisService();

function createErrorResponse(code: ErrorCode, message: string): ErrorResponse {
  return {
    error: {
      code,
      message
    }
  };
}

export function createServer() {
  const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

  const server = Fastify({
    logger: {
      level: apiConfig.logLevel
    },
    trustProxy: apiConfig.trustProxy
  });

  server.register(helmet);

  server.addHook("onSend", (_request, reply, payload, done) => {
    reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    done(null, payload);
  });

  server.register(cors, {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = new Set(apiConfig.corsOrigins);
      const isAllowed = allowedOrigins.has(origin) || origin === "http://localhost:5173" || origin === "http://127.0.0.1:5173";

      callback(null, isAllowed);
    }
  });

  server.addHook("onRequest", (request, reply, done) => {
    if (!request.url.startsWith("/api/v1/analysis")) {
      done();
      return;
    }

    const now = Date.now();
    const key = request.ip || request.socket.remoteAddress || "unknown";
    const existing = rateLimitStore.get(key);

    if (!existing || now >= existing.resetAt) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + apiConfig.rateLimitTimeWindowMs
      });

      reply.header("X-RateLimit-Limit", String(apiConfig.rateLimitMax));
      reply.header("X-RateLimit-Remaining", String(Math.max(0, apiConfig.rateLimitMax - 1)));
      reply.header("X-RateLimit-Reset", String(Math.ceil((now + apiConfig.rateLimitTimeWindowMs) / 1000)));

      done();
      return;
    }

    if (existing.count >= apiConfig.rateLimitMax) {
      reply.header("X-RateLimit-Limit", String(apiConfig.rateLimitMax));
      reply.header("X-RateLimit-Remaining", "0");
      reply.header("X-RateLimit-Reset", String(Math.ceil(existing.resetAt / 1000)));
      reply.status(429).send(
        createErrorResponse(
          "RATE_LIMITED",
          "Too many analysis requests in a short period. Please retry shortly."
        )
      );
      return;
    }

    existing.count += 1;
    rateLimitStore.set(key, existing);

    reply.header("X-RateLimit-Limit", String(apiConfig.rateLimitMax));
    reply.header("X-RateLimit-Remaining", String(Math.max(0, apiConfig.rateLimitMax - existing.count)));
    reply.header("X-RateLimit-Reset", String(Math.ceil(existing.resetAt / 1000)));

    done();
  });

  server.setNotFoundHandler((request, reply) => {
    return reply.status(404).send(
      createErrorResponse("RISK_ENGINE_ERROR", `Route ${request.method} ${request.url} was not found.`)
    );
  });

  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send(
        createErrorResponse(
          "INVALID_INPUT",
          "The analysis request payload did not match the expected schema."
        )
      );
    }

    requestLogger(error, reply.server.log);

    return reply.status(500).send(
      createErrorResponse(
        "RISK_ENGINE_ERROR",
        "The request could not be completed because the analysis foundation is not fully wired yet."
      )
    );
  });
  server.get("/api/v1/health", () => {
    return {
      status: "ok",
      service: "mirrorai-api",
      version: "0.1.0"
    };
  });

  server.post("/api/v1/analysis", async (request, reply) => {
    const payload = AnalysisRequestSchema.parse(request.body);
    const result = AnalysisResultSchema.parse(await analysisService.analyze(payload));

    return reply.status(200).send(result);
  });

  return server;
}

function requestLogger(error: unknown, logger: FastifyBaseLogger) {
  if (error instanceof Error) {
    logger.error({ err: error }, error.message);
    return;
  }

  logger.error({ err: error }, "Unhandled API error");
}
