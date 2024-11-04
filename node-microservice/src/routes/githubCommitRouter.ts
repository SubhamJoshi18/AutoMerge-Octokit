import { Router } from 'express';
import githubCommitController from '../controller/githubCommitController.js';
import { validateAccessToken } from '../middleware/tokenHandler.js';

const githubCommitRouter = Router();

githubCommitRouter.get(
  '/commit/:repoName',
  validateAccessToken as any,
  githubCommitController.viewCurrentCommit
);

export default githubCommitRouter;
