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
  console.log(req.headers);
  const token = req.headers['githubtoken'] ?? req.headers?.githubtoken;
  console.log('This is a token', token);
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
