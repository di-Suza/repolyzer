import githubClient from '../config/github.js';
import { AppError } from '../utils/appError.js';

const requirePathValue = (value, label) => {
  if (!value || !String(value).trim()) {
    throw new AppError(`${label} is required`, 400);
  }

  return encodeURIComponent(String(value).trim());
};

const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null));

const handleGithubError = (error, fallbackMessage) => {
  const statusCode = error.response?.status ?? 500;
  const message = error.response?.data?.message ?? fallbackMessage;

  throw new AppError(message, statusCode);
};

const requestGithub = async (request, fallbackMessage) => {
  try {
    const { data } = await request();
    return data;
  } catch (error) {
    handleGithubError(error, fallbackMessage);
  }
};

export const getGithubUser = async (username) => {
  const safeUsername = requirePathValue(username, 'GitHub username');

  return requestGithub(
    () => githubClient.get(`/users/${safeUsername}`),
    `Unable to fetch GitHub user ${username}`,
  );
};

export const getGithubUserRepos = async (
  username,
  { page = 1, perPage = 30, sort = 'updated', direction = 'desc', type = 'owner' } = {},
) => {
  const safeUsername = requirePathValue(username, 'GitHub username');

  return requestGithub(
    () =>
      githubClient.get(`/users/${safeUsername}/repos`, {
        params: cleanParams({
          page,
          per_page: perPage,
          sort,
          direction,
          type,
        }),
      }),
    `Unable to fetch repositories for GitHub user ${username}`,
  );
};

export const getGithubRepository = async (owner, repo) => {
  const safeOwner = requirePathValue(owner, 'Repository owner');
  const safeRepo = requirePathValue(repo, 'Repository name');

  return requestGithub(
    () => githubClient.get(`/repos/${safeOwner}/${safeRepo}`),
    `Unable to fetch GitHub repository ${owner}/${repo}`,
  );
};
