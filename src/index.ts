import { Server } from 'http';
import config from './config/config';
import logger from './config/logger';
import { createServer } from 'http';
import { Application } from 'express';

const app: Application = require('./app').default;

export const server: Server = createServer(app);

import admin from 'firebase-admin'
import serviceAccount from './config/adminsdkConfig.json'

admin.initializeApp({
// @ts-ignore
  credential: admin.credential.cert(serviceAccount)
});
    server.listen(config.port || 3000, () => {
      logger.info(`Listening to port ${config.port}`);
    });
// createConnection()
//   .then(async () => {
//     logger.info('CONNECTED TO THE DATABASE');

    
//   })
//   .catch(error => {
//     logger.error('FAILED TO CONNECT TO THE DATABASE');
//     logger.error(error);
//   });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

const unhandledRejectionHandler = (reason: any, promise: Promise<any>): void => {
  logger.error(reason);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');

  if (server) {
    server.close();
  }
});
