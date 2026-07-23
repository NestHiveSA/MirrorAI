import Fastify from "fastify";
import { ZodError } from "zod";
import {
  AnalysisRequestSchema,
  type ErrorCode,
  type ErrorResponse
} from "@mirrorai/shared";
import {
  AnalysisNotImplementedError,
  AnalysisService
} from "./services/analysis-service.js";

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
  const server = Fastify({
    logger: false
  });

  server.get("/api/v1/health", () => {
    return {
      status: "ok",
      service: "mirrorai-api",
      version: "0.1.0"
    };
  });

  server.post("/api/v1/analysis", async (request, reply) => {
    try {
      const payload = AnalysisRequestSchema.parse(request.body);
      await analysisService.analyze(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(
          createErrorResponse(
            "INVALID_INPUT",
            "The analysis request payload did not match the expected schema."
          )
        );
      }

      if (error instanceof AnalysisNotImplementedError) {
        return reply
          .status(501)
          .send(createErrorResponse(error.code, error.message));
      }

      return reply.status(500).send(
        createErrorResponse(
          "RISK_ENGINE_ERROR",
          "The request could not be completed because the analysis foundation is not fully wired yet."
        )
      );
    }
  });

  return server;
}
