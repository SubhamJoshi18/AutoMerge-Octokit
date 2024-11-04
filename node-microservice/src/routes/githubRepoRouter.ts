import { Router } from 'express';
import githubRepoController from '../controller/githubRepoController.js';
import { validateAccessToken } from '../middleware/tokenHandler.js';

const githubRepoRouter = Router();

githubRepoRouter.get(
  '/repo',
  validateAccessToken as any,
  githubRepoController.viewAllRepo 
);

export default githubRepoRouter;
