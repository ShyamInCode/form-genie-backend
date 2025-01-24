import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
// @ts-ignore
import xss from 'xss-clean';
import config from './config/config';
import morgan from './config/morgan';
import { ENVIRONMENTS } from './constants';
import { errorConverter, errorHandler } from './middlewares/error';
import { authLimiter } from './middlewares/rateLimiter';
import rootRoutes from './modules/root/root.route';
import routes from './modules/routes';
import ApiError from './utils/ApiError';

const app: Application = express();

if (config.env === ENVIRONMENTS.PRODUCTION) {
  app.set('trust proxy', 1); // trust first proxy
}


if (config.env !== 'test') {
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());


// enable cors
app.use(
  cors(),
);
// {
//   credentials: true,
//   origin: config.CORS_ORIGIN.split(','),
// }
// @ts-ignore
app.options('*', cors());

// limit repeated failed requests to auth endpoints
if (config.env === ENVIRONMENTS.PRODUCTION) {
  app.use('/v1/auth', authLimiter as unknown as express.RequestHandler);
}

// root routes, such as health
app.use('/', rootRoutes);

// v1 api routes
app.use('/v1', routes);

// // send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
