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
  viewLatestAndPreviousCompare = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repoName = req.params.repoName as string;
      const githubToken = req.githubToken ?? '';
      if (githubToken.length == 0) {
        throw new Error(`Octo Token Does not Exists`);
      }

      const response = await githubCommitService.compareAndRevertToLatestCommit(
        githubToken,
        repoName
      );

      res.status(201).json({
        message: 'Compare Latest and Previous File Changes and Commit',
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new GithubCommitController();
