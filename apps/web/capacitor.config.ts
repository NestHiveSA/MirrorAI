import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ma.nesthive.mirrorai",
  appName: "MirrorAI",
  webDir: "dist",
  android: {
    // The app runs the risk engine on-device and never needs cleartext traffic.
    allowMixedContent: false,
    // Android 16 forces edge-to-edge; keep the web view clear of the system bars.
    adjustMarginsForEdgeToEdge: "auto"
  }
};

export default config;
