import { createServer } from "./server.js";
import { apiConfig } from "./config.js";

const server = createServer();
const port = apiConfig.port;

server
  .listen({
    host: apiConfig.host,
    port
  })
  .catch(async (error) => {
    console.error(error);
    await server.close();
    process.exitCode = 1;
  });

