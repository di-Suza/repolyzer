import { getGithubRepository, getGithubUserRepos } from '../services/github.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUserRepos = catchAsync(async (req, res) => {
  const repos = await getGithubUserRepos(req.params.username, {
    page: req.query.page,
    perPage: req.query.perPage ?? req.query.per_page,
    sort: req.query.sort,
    direction: req.query.direction,
    type: req.query.type,
  });

  res.status(200).json({
    status: 'success',
    results: repos.length,
    data: {
      repos,
    },
  });
});

export const getRepo = catchAsync(async (req, res) => {
  const repo = await getGithubRepository(req.params.owner, req.params.repo);

  res.status(200).json({
    status: 'success',
    data: {
      repo,
    },
  });
});
