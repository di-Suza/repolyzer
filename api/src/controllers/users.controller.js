import { getGithubUser } from '../services/github.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUser = catchAsync(async (req, res) => {
  // Keep the controller thin: validation, caching, and GitHub error mapping live in the service.
  const user = await getGithubUser(req.params.username);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
