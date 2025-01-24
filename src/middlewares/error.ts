import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import { ENVIRONMENTS } from '../constants';
import ApiError from '../utils/ApiError';

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode: number = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || (httpStatus as any)[statusCode];
    error = new ApiError(statusCode, message, { isOperational: false, stack: err.stack });
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { error, meta, statusCode, message } = err;
  if (config.env === ENVIRONMENTS.PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    error,
    meta,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
