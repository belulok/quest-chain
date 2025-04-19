import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { sponsorRoutes } from './routes/sponsor.js';
import { healthRoutes } from './routes/health.js';
import { setupWebsocketServer } from './websocket/server.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const server = Fastify({
    logger: true,
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });
  
  await server.register(websocket, {
    options: { maxPayload: 1048576 } // 1MB
  });

  // Register routes
  server.register(healthRoutes);
  server.register(sponsorRoutes, { prefix: '/api' });
  
  // Setup WebSocket server
  setupWebsocketServer(server);

  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
