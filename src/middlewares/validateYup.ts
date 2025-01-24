import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { pick } from 'lodash';
import * as Yup from 'yup';
import ApiError from '../utils/ApiError';

// Only supports body at the moment
const validateYup =
  (schema: { body?: Yup.AnyObjectSchema; query?: Yup.AnyObjectSchema; params?: Yup.AnyObjectSchema }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));

    try {
      const value = await validSchema.body?.validate(object.body, {
        abortEarly: false,
        context: { userRole:  '' },
        stripUnknown: true,
      });

      Object.assign(req.body, value);
      return next();
    } catch (error: any) {
      return next(
        new ApiError(httpStatus.BAD_REQUEST, 'Please fix the form errors', {
        }),
      );
    }
  };

export default validateYup;
