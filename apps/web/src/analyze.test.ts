import { describe, expect, it, vi } from "vitest";

vi.mock("./config", () => ({ analysisMode: "local", apiBaseUrl: "" }));

describe("analyze in local mode", () => {
  it("runs the risk engine on the device without calling the network", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { analyze } = await import("./analyze");

    const result = await analyze({
      input_type: "INPUT-TEXT",
      content: "سلام خويا، ربحتي كادو، صيفط ليا الكود اللي جاك فالميساج"
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.signals.map((signal) => signal.signal_id)).toContain("SIG-014");
  });
});
