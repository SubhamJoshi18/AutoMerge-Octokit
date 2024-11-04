import { Router } from 'express';
import type, { Application, Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from '../middleware/errorHandler.js';
import githubProfileRouter from './githubProfileRoute.js';

export const initializeRouter = (expressApplication: Application) => {
  expressApplication.get('/test', (req: Request, res: Response): any =>
    res.status(201).json({
      message: 'Testing and Working',
    })
  );
  expressApplication.use('/api', [githubProfileRouter]);

  expressApplication.use(
    '*',
    (req: Request, res: Response, _next: NextFunction): void => {
      res.status(404).json({
        message: `${req.originalUrl} Does not Exists in the Origin`,
      });
    }
  );

  expressApplication.use(globalErrorHandler as any);
};
