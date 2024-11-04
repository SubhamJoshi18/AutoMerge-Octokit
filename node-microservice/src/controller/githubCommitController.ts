import githubCommitService from '../services/githubCommitService.js';
import type, { Request, Response, NextFunction } from 'express';

class GithubCommitController {
  viewCurrentCommit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const repoName = req.params.repoName;
      const octoToken = req.githubToken ?? '';
      if (!octoToken || octoToken.length === 0) {
        throw new Error('Octo Token Of User is Empty');
      }
      const response = await githubCommitService.viewCurrentCommit(
        octoToken as string,
        repoName as string
      );
      res.status(201).json({
        message: 'Current Commit of this Repo',
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new GithubCommitController();
