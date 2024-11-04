import { Router } from 'express';
import type, { Request, Response } from 'express';
import githubProfileController from '../controller/githubProfileController.js';
import { validateBody } from '../middleware/validationHandler.js';
import { validateAccessToken } from '../middleware/tokenHandler.js';

const githubProfileRouter: Router = Router();

githubProfileRouter.post('/token', githubProfileController.validateGithubToken);

githubProfileRouter.get(
  '/profile',
  validateAccessToken as any,
  githubProfileController.viewProfile
);

export default githubProfileRouter;
