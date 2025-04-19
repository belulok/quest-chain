import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/healthz', async () => {
    return { status: 'ok', version: '0.3.0' };
  });
}
