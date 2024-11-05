import { Octokit } from 'octokit';
import { getRepoOWnerName } from '../extractor/extract.js';
import { GitException } from '../exceptions/index.js';
import gitLogger from '../libs/logger.js';
import RabbitMqProducer from '../queues/producer/RabbitMqProducer.js';
import {
  modelQueueName,
  modelQueueExchange,
  modelQueueRoutingKey,
} from '../constants/queueConstant.js';

abstract class GithubCommitSerAbs {
  abstract viewCurrentCommit(octoToken: string, repoName: string): Promise<any>;
  abstract compareAndRevertToLatestCommit(
    octoToken: string,
    repoName: string
  ): Promise<any>;
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

  async compareAndRevertToLatestCommit(
    octoToken: string,
    repoName: string
  ): Promise<any> {
    const payload = {
      previousChangesFile: [],
      latestChangesFile: [],
    };
    const octokit = await this.connectOctokit(octoToken as string);
    const ownerName = await getRepoOWnerName(octoToken as string);
    const { data: commit } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: ownerName,
        repo: repoName,
        per_page: 2,
      }
    );

    if (commit.length == 0) {
      throw new GitException(
        401,
        `There is no commit for this Repo : ${repoName} `
      );
    }

    const latestCommitSha = commit[0].sha;
    const previousCommitSha = commit[1].sha;

    const latestChangesCode = [];
    const previousChangesCode = [];

    const latestCommitDetails = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: ownerName,
        repo: repoName,
        commit_sha: latestCommitSha,
      }
    );

    const previousCommitDetails = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}',
      {
        owner: ownerName,
        repo: repoName,
        commit_sha: previousCommitSha,
      }
    );

    for (const file of latestCommitDetails.data.files) {
      const { data: fileContent }: any = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner: ownerName,
          repo: repoName,
          path: file.filename,
          ref: latestCommitSha,
        }
      );

      const randomContent = Buffer.from(
        fileContent.content as any,
        'base64'
      ).toString('utf-8');

      console.log(`Content of ${file.filename}`);
      latestChangesCode.push(randomContent);
    }

    for (const file of previousCommitDetails.data.files) {
      const { data: fileContent }: any = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner: ownerName,
          repo: repoName,
          path: file.filename,
          ref: previousCommitSha,
        }
      );

      const randomContent = Buffer.from(
        fileContent.content as any,
        'base64'
      ).toString('utf-8');

      console.log(`Content of ${file.filename}`);
      previousChangesCode.push(randomContent);
    }

    payload['previousChangesFile'] = Array.from(new Set(previousChangesCode));
    payload['latestChangesFile'] = Array.from(new Set(latestChangesCode));

    const modelProducer = new RabbitMqProducer(
      modelQueueName,
      modelQueueExchange,
      modelQueueRoutingKey
    );

    await modelProducer.send_to_queue(payload)
  }

  private async connectOctokit(octoToken: string) {
    const octokit = new Octokit({
      auth: octoToken,
    });
    return octokit;
  }
}

export default new GithubCommitSer();
