import { Router } from 'express';
import type, { Request, Response } from 'express';
import githubProfileController from '../controller/githubProfileController.js';
import { validateBody } from '../middleware/validationHandler.js';

const githubProfileRouter: Router = Router();

githubProfileRouter.post(
  '/token',
  githubProfileController.validateGithubToken
);

githubProfileRouter.get('/profile', githubProfileController.viewProfile);




export default githubProfileRouter;
