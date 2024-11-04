import { Octokit } from 'octokit';
import { getRepoOWnerName } from '../extractor/extract.js';
import { GitException } from '../exceptions/index.js';
import gitLogger from '../libs/logger.js';

abstract class GithubCommitSerAbs {
  abstract viewCurrentCommit(octoToken: string, repoName: string): Promise<any>;
}

class GithubCommitSer extends GithubCommitSerAbs {
  async viewCurrentCommit(octoToken: string, repoName: string): Promise<any> {
    const octokit = await this.connectOctokit(octoToken as string);
    const ownerName = await getRepoOWnerName(octoToken as string);

    const { data: commits } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: ownerName as any,
        repo: repoName,
        per_page: 1,
      }
    );

    console.log('This is a data', commits);
    if (commits.length === 0 || commits.length.toString().startsWith('0')) {
      throw new GitException(403, `No Commit Found in this ${repoName}`);
    }
    const latestCommitSha = commits[0].sha;

    const { data: commitDetails } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: ownerName,
        repo: repoName,
        commit_sha: latestCommitSha,
      }
    );

    gitLogger.info(`Latest Commit SHA  : ${latestCommitSha}`);

    gitLogger.info(`Commit Message : ${commitDetails.commit.message}`);

    let payloads = {
      commitHistory: [],
    };

    for (const item of commitDetails.files) {
      let changesCommit = [];
      const payload = {
        latestCommitSha: latestCommitSha,
        commitMessage: commitDetails.commit.message,
        files_name: item.filename,
        file_status: item.status,
        file_changes: item.changes,
      };
      payloads['commitHistory'].push(payload);
    }
    return payloads;
  }

  async compareAndRevertToLatestCommit(): Promise<any> {}

  private async connectOctokit(octoToken: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    return octokit;
  }
}

export default new GithubCommitSer();
