import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AnalysisResultSchema, ErrorResponseSchema } from "@mirrorai/shared";
import { createServer } from "./server.js";

describe("POST /api/v1/analysis", () => {
  const server = createServer();

  beforeAll(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("returns a real analysis result", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/analysis",
      payload: {
        input_type: "INPUT-TEXT",
        content: "عاجل: نحن من البنك. أرسل رمز التحقق الآن لتجنب إيقاف الحساب"
      }
    });

    expect(response.statusCode).toBe(200);

    const payload = AnalysisResultSchema.parse(response.json());

    expect(payload.risk_level).toBe("CRITICAL");
    expect(payload.signals.length).toBeGreaterThan(0);
  });

  it("keeps invalid input validation at 400", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/analysis",
      payload: {
        input_type: "INPUT-TEXT"
      }
    });

    expect(response.statusCode).toBe(400);
    const errorPayload = ErrorResponseSchema.parse(response.json());

    expect(errorPayload).toEqual({
      error: {
        code: "INVALID_INPUT",
        message: "The analysis request payload did not match the expected schema."
      }
    });
  });
});