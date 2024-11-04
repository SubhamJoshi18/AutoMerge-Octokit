import type, { Request, Response, NextFunction } from 'express';
import githubRepoService from '../services/githubRepoService.js';

class GithubRepoController {
  viewAllRepo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const octoToken = req.githubToken ?? '';
      if (!octoToken || octoToken.length === 0) {
        throw new Error(`Octo Token Does not Exists`);
      }

      const response = await githubRepoService.viewAllRepo(octoToken);
      
      res.status(201).json({
        message: 'All Repo for User Fetches',
        data: response,
      });
    } catch (err: unknown) {
      next(err);
    }
  };
}

export default new GithubRepoController();