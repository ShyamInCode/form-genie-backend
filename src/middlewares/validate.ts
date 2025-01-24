import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { Schema } from 'joi';
import { pick } from 'lodash';
import ApiError from '../utils/ApiError';

const validate = (schema: { [key: string]: Schema<any> }) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ');

    const errorObj: { [key: string]: any } = {};

    error.details.forEach(details => {
      if (!details.context) {
        return;
      }

      errorObj[details.context.key as string] = details.message;
    });

    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, { error: errorObj }));
  }

  Object.assign(req, value);

  return next();
};

export default validate;
