import dotenv from 'dotenv';
import gitLogger from './libs/logger.js';
import ExpressServer from './server.js';
import { getKeyValue } from './utils/envUtils.js';

const serverPort = getKeyValue('port');

async function startExpressServer() {
  try {
    const expressServerInstance = new ExpressServer(
      Number(serverPort) as number
    );

    expressServerInstance.startExpressServer();
  } catch (err) {
    if (err instanceof Error) {
      gitLogger.error(`${err}`);
    }
  }
}
startExpressServer();
