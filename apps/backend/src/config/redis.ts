// config/redis.ts
import { Redis } from 'ioredis';

// Get Redis configuration from environment variables
const REDIS_HOST =
  process.env.REDIS_HOST ||
  process.env.REDIS_URL?.replace('redis://', '').split(':')[0] ||
  '127.0.0.1';
const REDIS_PORT_NUM = parseInt(
  process.env.REDIS_PORT || process.env.REDIS_URL?.split(':')[2] || '6379'
);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Enhanced Redis configuration for better stability
const redisConfig: any = {
  host: REDIS_HOST,
  port: REDIS_PORT_NUM,

  // Connection timeout settings
  connectTimeout: 10000,
  commandTimeout: 15000, // Increased from 5000 to 15000 for cloud Redis

  // Retry configuration
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 300,
  maxRetriesPerRequest: null, // BullMQ requires this to be null

  // Connection pooling and keep-alive
  keepAlive: 30000,
  family: 4, // Force IPv4

  // Lazy connection for better startup
  lazyConnect: true,

  // Disable offline queue to prevent memory issues
  enableOfflineQueue: false,

  // For cloud Redis services like Upstash
  enableReadyCheck: true,

  // Additional stability settings
  maxmemoryPolicy: 'allkeys-lru',
};

// Add password if provided
if (REDIS_PASSWORD) {
  redisConfig.password = REDIS_PASSWORD;
}

// Add TLS configuration for production cloud Redis
if (
  NODE_ENV === 'production' &&
  REDIS_PASSWORD &&
  (process.env.REDIS_TLS === 'true' || REDIS_HOST.includes('upstash'))
) {
  redisConfig.tls = {
    rejectUnauthorized: false,
    servername: REDIS_HOST,
  };
}

// Create Redis instance with connection pool
export const redisClient = new Redis(redisConfig);

// Enhanced connection event handling
redisClient.on('connect', () => {
  console.log(`Redis client connected to ${REDIS_HOST}:${REDIS_PORT_NUM}`);
});

redisClient.on('ready', () => {
  console.log('Redis client is ready to use');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
  // Don't log full error object to avoid spam
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

redisClient.on('reconnecting', (delay) => {
  console.log(`Redis client reconnecting in ${delay}ms...`);
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

export const REDIS_URI = REDIS_HOST;
export const REDIS_PORT = REDIS_PORT_NUM;

export default {
  REDIS_URI,
  REDIS_PORT,
  redisClient,
};

// Enhanced Redis health check with retry logic
export const testRedisConnection = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await Promise.race([
        redisClient.ping(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Ping timeout')), 5000)
        ),
      ]);

      if (result === 'PONG') {
        return true;
      }
    } catch (error) {
      console.error(
        `Redis health check attempt ${i + 1} failed:`,
        error.message
      );

      if (i === retries - 1) {
        console.error('All Redis health check attempts failed');
        return false;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

// Connection monitoring function
export const monitorRedisConnection = () => {
  setInterval(async () => {
    const isHealthy = await testRedisConnection(1);
    if (!isHealthy) {
      console.warn('Redis connection health check failed');
    }
  }, 30000); // Check every 30 seconds
};
