// config/redis.ts
import { Redis } from 'ioredis';

// Get Redis configuration from environment variables
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT_NUM = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// Create a Redis instance with TLS
export const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT_NUM,
  password: REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false,
  },
  // Connection settings
  connectTimeout: 10000,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  keepAlive: 30000,
});

// Listen for Redis connection events
redisClient.on('connect', () => {
  console.log(`Redis client connected to ${REDIS_HOST}:${REDIS_PORT_NUM}`);
});

redisClient.on('ready', () => {
  console.log('Redis client is ready to use');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

export const REDIS_URI = REDIS_HOST;
export const REDIS_PORT = REDIS_PORT_NUM;

export default {
  REDIS_URI,
  REDIS_PORT,
  redisClient,
};
