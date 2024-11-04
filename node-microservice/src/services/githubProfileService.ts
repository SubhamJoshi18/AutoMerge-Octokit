import { Octokit } from 'octokit';
import gitLogger from '../libs/logger.js';
import { GitException } from '../exceptions/index.js';
import { extractUserData } from '../extractor/extract.js';
import crypto from 'crypto';
import initializeRedis from '../config/redisConfig.js';
import { nanoid } from 'nanoid';
import { getKeyProfileValue } from '../utils/keys.js';

class GitHubProfileSer {
  public async viewProfile(octoToken: string) {
    let octokit: Octokit;
    let retryCount = 3;
    let retryStatus = true;

    octokit = new Octokit({
      auth: octoToken,
    });

    while (retryCount > 0 && retryStatus) {
      if (!octokit) {
        gitLogger.warn(
          `Cannot Authenticating to the github octokit , Retrying it .. ${retryCount}`
        );
        octokit = new Octokit({
          auth: octoToken,
        });
        retryCount -= 1;
      } else {
        break;
      }
    }

    const response = await octokit.request('GET /user');
    const userData = response.hasOwnProperty('data') ? response['data'] : null;

    if (!userData) {
      gitLogger.error(`User Data Credential Does not Match.....`);
      throw new GitException(403, 'User Data Credential Does not match');
    }
    const payloadData = extractUserData(userData);
    return payloadData;
  }

  public async validateGithubToken(octoToken: string) {
    const redisClient = await initializeRedis();
    let octokit: Octokit;
    let retryCount = 3;
    let retryStatus = true;

    octokit = new Octokit({
      auth: octoToken,
    });

    while (retryCount > 0 && retryStatus) {
      if (!octokit) {
        gitLogger.warn(
          `Cannot Authenticating to the github octokit , Retrying it .. ${retryCount}`
        );
        retryCount -= 1;
        octokit = new Octokit({
          auth: octoToken,
        });
      } else {
        break;
      }
    }
    const response = await octokit.request('GET /user');
    console.log(response);
    if (!response.hasOwnProperty('data') || !response['data']) {
      throw new GitException(
        403,
        'Github Access Token is invalid and does not match'
      );
    }
    const hashAccessToken = crypto
      .createHash('sha256')
      .update(JSON.stringify(response['data']).toString(), 'utf-8')
      .digest('hex');

    const hashValueData = {
      user_name: response['data']['login'],
      user_follower: response['data']['followers'],
      user_following: response['data']['following'],
      hash_git_token: hashAccessToken,
    };
    const randomId = nanoid();

    const profileKey = getKeyProfileValue(randomId);

    const saveResult = await redisClient.hSet(profileKey, hashValueData);

    gitLogger.info(`Successfully saved ${saveResult} fields in redis...`);

    return { hashAccessToken, octoToken };
  }
}

export default new GitHubProfileSer();
