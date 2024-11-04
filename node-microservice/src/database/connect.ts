import mongoose from 'mongoose';
import gitLogger from '../libs/logger.js';
import { getKeyValue } from '../utils/envUtils.js';
const connectMongoDb = async () => {
  try {
    const mongoUrl = getKeyValue('mongoUri');

    const connection = await mongoose.connect(mongoUrl as string);

    gitLogger.info(`Mongo DB is connected.. ${connection.Connection.name}`);

    mongoose.connection.on('disconnect', () => {
      gitLogger.info(
        `Mongo DB is Disconnected.....${connection.Connection.name}`
      );
    });

    mongoose.connection.on('error', (err: unknown) => {
      throw new Error(err as any);
    });
  } catch (err) {
    gitLogger.error(`Error in Connecting Mongo DB Database`);
    process.exit(0);
  }
};

export { connectMongoDb };
