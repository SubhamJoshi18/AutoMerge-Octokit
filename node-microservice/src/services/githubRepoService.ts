import { Octokit } from 'octokit';
import gitLogger from '../libs/logger.js';

abstract class GithubRepoSerAbs {
  abstract viewAllRepo(octoToken: string): Promise<any>;
}

class GithubRepoSer extends GithubRepoSerAbs {
  async viewAllRepo(octoToken: string): Promise<any> {
    let octokit: Octokit;
    let retryCount: number = 0;
    let retryCountStatus: boolean = true;

    const filterData = {
      private: [],
      public: [],
    };

    octokit = this.connectOctokit(octoToken as string);

    while (retryCount > 0 && retryCountStatus) {
      if (!octokit) {
        gitLogger.info(
          `Retrying to connect the Octokit again on the ${retryCount}`
        );

        octokit = this.connectOctokit(octoToken as string);
        retryCount = retryCount - 1;
      } else {
        gitLogger.info(`Already Connected to the Octokit`);
        break;
      }
    }

    const repoResponse = await octokit.request('GET /user/repos', {
      per_page: 100,
      visibility: 'all',
    });

    const allRepo = new Set();

    for (const [key, value] of Object.entries(repoResponse['data'])) {
      allRepo.add(value);
    }

    Array.from(allRepo).filter((data) => {
      if (typeof data['private'] === 'boolean' && data['private']) {
        filterData['private'].push(data);
      } else {
        filterData['public'].push(data);
      }
    });

    return filterData;
  }

  private connectOctokit(octoToken: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    return octokit;
  }
}

export default new GithubRepoSer();
