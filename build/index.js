"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./config/logger"));
const http_1 = require("http");
const app = require('./app').default;
exports.server = (0, http_1.createServer)(app);
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const adminsdkConfig_json_1 = __importDefault(require("./config/adminsdkConfig.json"));
firebase_admin_1.default.initializeApp({
    // @ts-ignore
    credential: firebase_admin_1.default.credential.cert(adminsdkConfig_json_1.default)
});
exports.server.listen(config_1.default.port || 3000, () => {
    logger_1.default.info(`Listening to port ${config_1.default.port}`);
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
    if (exports.server) {
        exports.server.close(() => {
            logger_1.default.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
const unhandledRejectionHandler = (reason, promise) => {
    logger_1.default.error(reason);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unhandledRejectionHandler);
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received');
    if (exports.server) {
        exports.server.close();
    }
});
//# sourceMappingURL=index.js.map