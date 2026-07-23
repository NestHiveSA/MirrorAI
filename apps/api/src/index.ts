import { createServer } from "./server.js";

const server = createServer();
const port = Number(process.env.PORT ?? 3001);

server
  .listen({
    host: "0.0.0.0",
    port
  })
  .catch(async (error) => {
    console.error(error);
    await server.close();
    process.exitCode = 1;
  });

