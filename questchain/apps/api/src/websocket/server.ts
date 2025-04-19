import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { getRedisClient } from '../services/redis.js';

// Store connected clients
const clients = new Set<WebSocket>();

// Game state
let bossHP = 1000;
const MAX_BOSS_HP = 1000;

export function setupWebsocketServer(fastify: FastifyInstance) {
  // Setup WebSocket route
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const client = connection.socket;
    
    // Add client to the set
    clients.add(client);
    
    // Send initial state
    sendGameState(client);
    
    // Handle messages from clients
    client.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'attack') {
          await handleAttack(data.damage, data.sender);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        client.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format' 
        }));
      }
    });
    
    // Handle client disconnect
    client.on('close', () => {
      clients.delete(client);
    });
  });
  
  // Start boss HP regeneration
  startBossHPRegeneration();
}

// Send game state to a specific client
function sendGameState(client: WebSocket) {
  client.send(JSON.stringify({
    type: 'gameState',
    bossHP,
    maxBossHP: MAX_BOSS_HP,
    timestamp: Date.now()
  }));
}

// Broadcast game state to all clients
function broadcastGameState() {
  const message = JSON.stringify({
    type: 'gameState',
    bossHP,
    maxBossHP: MAX_BOSS_HP,
    timestamp: Date.now()
  });
  
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Handle attack from a client
async function handleAttack(damage: number, sender: string) {
  // Validate damage (prevent cheating)
  const validatedDamage = Math.min(Math.max(1, damage), 100);
  
  // Update boss HP
  bossHP = Math.max(0, bossHP - validatedDamage);
  
  // Store boss HP in Redis
  const redis = getRedisClient();
  await redis.set('boss:hp', bossHP.toString());
  
  // Broadcast updated game state
  broadcastGameState();
  
  // Check if boss is defeated
  if (bossHP === 0) {
    // Reset boss HP after 10 seconds
    setTimeout(async () => {
      bossHP = MAX_BOSS_HP;
      await redis.set('boss:hp', bossHP.toString());
      broadcastGameState();
    }, 10000);
  }
}

// Start boss HP regeneration (1 HP every 5 seconds)
function startBossHPRegeneration() {
  setInterval(async () => {
    if (bossHP < MAX_BOSS_HP && bossHP > 0) {
      bossHP = Math.min(MAX_BOSS_HP, bossHP + 1);
      
      // Store boss HP in Redis
      const redis = getRedisClient();
      await redis.set('boss:hp', bossHP.toString());
      
      // Broadcast updated game state
      broadcastGameState();
    }
  }, 5000);
}
