import type, { Request, Response, NextFunction } from 'express';
import gitLogger from '../libs/logger.js';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      githubToken?: any;
    }
  }
}

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['githubToken'] ?? req.headers?.githubToken;

  if (!token) {
    gitLogger.error(`Cannot Find the Github Token to Validate`);
    return res.status(404).json({
      validate: false,
      message: 'Cannot Find the Github Token to Validate',
    });
  }

  req.githubToken = token;
  next();
};
