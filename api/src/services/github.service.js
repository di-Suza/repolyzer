import githubClient from '../config/github.js';
import { AppError } from '../utils/appError.js';
import { get as getCache, set as setCache } from './cache.service.js';

const CACHE_TTL = 60 * 1000;

const requirePathValue = (value, label) => {
  // Validate and encode path params before interpolating them into GitHub URLs.
  if (!value || !String(value).trim()) {
    throw new AppError(`${label} is required`, 400);
  }

  return encodeURIComponent(String(value).trim());
};

const cleanParams = (params) =>
  // Drop empty query params so GitHub applies its own defaults instead of receiving "undefined".
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null));

const createCacheKey = (...parts) => parts.map((part) => String(part).trim().toLowerCase()).join(':');

const handleGithubError = (error, fallbackMessage) => {
  // Preserve GitHub's status/message when available, then let the global handler format it.
  const statusCode = error.response?.status ?? 500;
  const message = error.response?.data?.message ?? fallbackMessage;

  throw new AppError(message, statusCode);
};

const requestGithub = async (cacheKey, request, fallbackMessage) => {
  // Check the short-lived cache before spending GitHub API quota.
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const { data } = await request();
    // Cache successful responses only; failed GitHub requests should be retried normally.
    setCache(cacheKey, data, CACHE_TTL);
    return data;
  } catch (error) {
    handleGithubError(error, fallbackMessage);
  }
};

export const getGithubUser = async (username) => {
  const safeUsername = requirePathValue(username, 'GitHub username');
  // User profiles are cached by normalized username so repeated searches are fast for 60 seconds.
  const cacheKey = createCacheKey('github', 'user', safeUsername);

  return requestGithub(
    cacheKey,
    () => githubClient.get(`/users/${safeUsername}`),
    `Unable to fetch GitHub user ${username}`,
  );
};

export const getGithubUserRepos = async (
  username,
  { page = 1, perPage = 30, sort = 'updated', direction = 'desc', type = 'owner' } = {},
) => {
  const safeUsername = requirePathValue(username, 'GitHub username');
  // Keep frontend-friendly perPage while sending GitHub's expected per_page query name.
  const params = cleanParams({
    page,
    per_page: perPage,
    sort,
    direction,
    type,
  });
  // Params are part of the cache key so sort/page/type variants never overwrite each other.
  const cacheKey = createCacheKey('github', 'user-repos', safeUsername, JSON.stringify(params));

  return requestGithub(
    cacheKey,
    () =>
      githubClient.get(`/users/${safeUsername}/repos`, {
        params,
      }),
    `Unable to fetch repositories for GitHub user ${username}`,
  );
};
