import { describe, expect, it } from "vitest";
import { AWARENESS_DIMENSIONS, AWARENESS_QUESTIONS, awarenessLevel, scoreAwareness } from "./awareness";

const answerAll = (value: (key: string) => number) =>
  Object.fromEntries(AWARENESS_QUESTIONS.map((question) => [question.key, value(question.key)]));

describe("Digital Awareness Index", () => {
  it("asks 4 statements for each of the 6 dimensions", () => {
    expect(AWARENESS_DIMENSIONS).toHaveLength(6);
    expect(AWARENESS_QUESTIONS).toHaveLength(24);
    expect(new Set(AWARENESS_QUESTIONS.map((question) => question.key)).size).toBe(24);
  });

  it("scores the mean of dimension means × 20", () => {
    expect(scoreAwareness(answerAll(() => 5)).score).toBe(100);
    expect(scoreAwareness(answerAll(() => 3)).score).toBe(60);
    expect(scoreAwareness(answerAll(() => 1)).score).toBe(20);
  });

  it("points to the weakest dimension", () => {
    const result = scoreAwareness(answerAll((key) => (key.startsWith("security-") ? 1 : 4)));

    expect(result.weakest.dimension.id).toBe("security");
    expect(result.weakest.score).toBe(20);
    expect(result.score).toBe(70);
  });

  it("uses the theory's level bands", () => {
    expect(awarenessLevel(40).label).toBe("وعي منخفض");
    expect(awarenessLevel(41).label).toBe("وعي متوسط");
    expect(awarenessLevel(66).label).toBe("وعي مرتفع");
    expect(awarenessLevel(86).label).toBe("وعي متقدم");
  });

  it("refuses incomplete answers", () => {
    expect(() => scoreAwareness({})).toThrow();
  });
});
