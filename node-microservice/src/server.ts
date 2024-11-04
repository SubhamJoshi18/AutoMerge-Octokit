import express, { Application } from 'express';
import gitLogger from './libs/logger.js';
import { initalizeMiddleware } from './middleware/serverHandler.js';
import { initializeRouter } from './routes/server.js';
import { connectMongoDb } from './database/connect.js';

class ExpressServer {
  private serverPort: number = 0;
  private expressApplication: Application = express();

  constructor(serverPort: number) {
    this.serverPort = serverPort;
    initalizeMiddleware(this.expressApplication);
    initializeRouter(this.expressApplication);
  }

  private async connectDatabase() {
    return connectMongoDb();
  }

  public startExpressServer(): void {
    this.connectDatabase().then(() => {
      this.expressApplication
        .listen(this.serverPort, () => {
          gitLogger.info(`Server is running on the port : ${this.serverPort}`);
        })
        .on('error', (error: unknown) => {
          throw new Error(error as any);
        });
    });
  }
}

export default ExpressServer;
