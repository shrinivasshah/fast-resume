import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";

const server = Fastify({
  logger: true,
});

// Plugins
await server.register(cors, {
  origin: "http://localhost:3000",
});
await server.register(helmet);
await server.register(sensible);

// Health check
server.get("/api/health", async () => {
  return { status: "ok", service: "gateway", timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`Gateway service running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
