import Redis from 'ioredis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    
    redisClient = new Redis(redisUrl, {
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      maxRetriesPerRequest: 3,
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  
  return redisClient;
}
