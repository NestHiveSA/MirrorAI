import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mirrorai/shared": fileURLToPath(
        new URL("../../packages/shared/src/index.ts", import.meta.url)
      ),
      "@mirrorai/knowledge": fileURLToPath(
        new URL("../../packages/knowledge/src/index.ts", import.meta.url)
      ),
      "@mirrorai/risk-engine": fileURLToPath(
        new URL("../../packages/risk-engine/src/index.ts", import.meta.url)
      )
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});

