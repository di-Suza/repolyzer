import { getGithubUserRepos } from '../services/github.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUserRepos = catchAsync(async (req, res) => {
  // Pass pagination/sort options through unchanged so the service can build GitHub-compatible params.
  const repos = await getGithubUserRepos(req.params.username, {
    page: req.query.page,
    perPage: req.query.perPage ?? req.query.per_page,
    sort: req.query.sort,
    direction: req.query.direction,
    type: req.query.type,
  });

  res.status(200).json({
    status: 'success',
    // results represents the current GitHub page size; the frontend uses it to decide Load More.
    results: repos.length,
    data: {
      repos,
    },
  });
});
