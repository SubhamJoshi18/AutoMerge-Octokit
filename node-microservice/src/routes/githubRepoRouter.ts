import { Router } from 'express';
import githubRepoController from '../controller/githubRepoController.js';
import { validateAccessToken } from '../middleware/tokenHandler.js';

const githubRepoRouter = Router();

githubRepoRouter.get(
  '/repo',
  validateAccessToken as any,
  githubRepoController.viewAllRepo
);

githubRepoRouter.delete(
  '/repo/:repoName',
  validateAccessToken as any,
  githubRepoController.deleteRepo
);

export default githubRepoRouter;
