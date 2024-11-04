import { Octokit } from 'octokit';
import type, { NextFunction, Request, Response } from 'express';
import envConfig from '../config/envConfig.js';
import githubProfileService from '../services/githubProfileService.js';
import { githubTokenI } from './types.js';

abstract class GithubProfileAbs {
  abstract viewProfile(req: Request, res: Response, next: NextFunction): any;
}

class GithubProfile extends GithubProfileAbs {
  viewProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const octoToken = envConfig['githubToken'];
      const response = await githubProfileService.viewProfile(
        octoToken as string
      );
      res.status(201).json({
        message: 'User Github Profile Fetches',
        data: response,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  validateGithubToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const tokenObject: Required<githubTokenI> = req.body;
      const response = await githubProfileService.validateGithubToken(
        tokenObject['githubToken']
      );
      res.status(201).json({
        message: 'User Authenticated Successfully',
        data: response,
      });
    } catch (err: unknown) {
      next(err);
    }
  };
}

export default new GithubProfile();
