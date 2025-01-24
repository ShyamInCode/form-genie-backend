"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = __importDefault(require("http-status"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const config_1 = __importDefault(require("./config/config"));
const morgan_1 = __importDefault(require("./config/morgan"));
const constants_1 = require("./constants");
const error_1 = require("./middlewares/error");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const root_route_1 = __importDefault(require("./modules/root/root.route"));
const routes_1 = __importDefault(require("./modules/routes"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const app = (0, express_1.default)();
if (config_1.default.env === constants_1.ENVIRONMENTS.PRODUCTION) {
    app.set('trust proxy', 1); // trust first proxy
}
if (config_1.default.env !== 'test') {
    app.use(morgan_1.default.errorHandler);
}
// set security HTTP headers
app.use((0, helmet_1.default)());
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// sanitize request data
app.use((0, xss_clean_1.default)());
// enable cors
app.use((0, cors_1.default)());
// {
//   credentials: true,
//   origin: config.CORS_ORIGIN.split(','),
// }
// @ts-ignore
app.options('*', (0, cors_1.default)());
// limit repeated failed requests to auth endpoints
if (config_1.default.env === constants_1.ENVIRONMENTS.PRODUCTION) {
    app.use('/v1/auth', rateLimiter_1.authLimiter);
}
// root routes, such as health
app.use('/', root_route_1.default);
// v1 api routes
app.use('/v1', routes_1.default);
// // send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(error_1.errorConverter);
// handle error
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map