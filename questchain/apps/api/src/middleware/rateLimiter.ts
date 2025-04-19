import { FastifyRequest, FastifyReply } from 'fastify';
import { getRedisClient } from '../services/redis.js';

const MAX_REQUESTS = 30; // 30 requests
const WINDOW_MS = 60 * 1000; // 1 minute

export async function rateLimiter(request: FastifyRequest, reply: FastifyReply) {
  const redis = getRedisClient();
  const ip = request.ip;
  const key = `ratelimit:${ip}`;
  
  try {
    // Get current count
    const currentCount = await redis.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    
    if (count >= MAX_REQUESTS) {
      throw new Error('Rate limit exceeded');
    }
    
    // Increment count
    if (count === 0) {
      await redis.set(key, '1', 'PX', WINDOW_MS);
    } else {
      await redis.incr(key);
    }
  } catch (error) {
    request.log.error(error);
    
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return reply.status(429).send({ 
        success: false, 
        error: 'Too many requests, please try again later' 
      });
    }
    
    // If Redis is down, we'll still allow the request to proceed
    request.log.warn('Rate limiter failed, allowing request to proceed');
  }
}
