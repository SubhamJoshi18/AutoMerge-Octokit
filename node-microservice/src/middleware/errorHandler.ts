import type, { Request, Response, NextFunction } from 'express';
import { extendExceptionType } from './types.js';
import { GitException } from '../exceptions/index.js';

export const globalErrorHandler = (
  err: extendExceptionType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof GitException) {
    return res.status(err.getStatusNumber()).json({
      message: err.getMessage(),
      statusCode: err.getStatusNumber(),
      error: true,
    });
  }
  return res.status(500).json({
    message: err.message,
    error: true,
  });
};
