import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sponsorTransaction } from '../services/sponsor.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const sponsorRequestSchema = z.object({
  txBytes: z.string(),
  sender: z.string(),
});

export async function sponsorRoutes(fastify: FastifyInstance) {
  fastify.post('/sponsor', {
    preHandler: rateLimiter,
    schema: {
      body: {
        type: 'object',
        required: ['txBytes', 'sender'],
        properties: {
          txBytes: { type: 'string' },
          sender: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { txBytes, sender } = sponsorRequestSchema.parse(request.body);
      
      const sponsoredTxBytes = await sponsorTransaction(txBytes, sender);
      
      return { 
        success: true, 
        sponsoredTxBytes 
      };
    } catch (error) {
      request.log.error(error);
      
      return reply.status(400).send({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
}
