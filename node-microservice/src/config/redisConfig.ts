import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import gitLogger from '../libs/logger.js';

async function initializeRedis() {
  let client: RedisClientType | undefined;
  try {
    client = createClient();

    client.on('error', (error) => {
      gitLogger.error(`Error connecting to the Redis server: ${error.message}`);
      process.exit(1); // Exit with a non-zero code for errors
    });

    client.on('connect', () => {
      gitLogger.info('Connected to Redis server successfully');
    });

    await client.connect();
  } catch (err) {
    gitLogger.warn(
      `Error initializing the Redis client: ${(err as Error).message}`
    );
    gitLogger.info(
      'Exiting Node.js process due to Redis initialization failure'
    );
    process.exit(1);
  }

  return client;
}

export default initializeRedis;
