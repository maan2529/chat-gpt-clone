const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
});

redis.on('connect', () => {
    console.log('✓ Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

redis.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

module.exports = redis;
