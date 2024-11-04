import { ZodSchema } from 'zod';
import type, { Request, Response, NextFunction } from 'express';
import { profileAuthenticatedSchema } from '../validation/profileValidation.js';
import gitLogger from '../libs/logger.js';

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = profileAuthenticatedSchema.safeParse(req.body);
    if (!result.error) {
      gitLogger.info(`Validation Passed...`);
      next();
    }
    return res.status(403).json({
      message: 'Validation Error',
      error_res: result.error.errors,
    });
  };
