import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '../utils/appError.js';

vi.mock('../services/github.service.js', () => ({
  getGithubUserRepos: vi.fn(),
}));

import { createApp } from '../app.js';
import { getGithubUserRepos } from '../services/github.service.js';

const app = createApp();

afterEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/repos/:username/repos', () => {
  it('returns repository array for a valid username', async () => {
    const repos = [
      {
        id: 1,
        name: 'hello-world',
        full_name: 'octocat/hello-world',
      },
    ];

    getGithubUserRepos.mockResolvedValue(repos);

    const response = await request(app).get('/api/repos/octocat/repos').expect(200);

    expect(getGithubUserRepos).toHaveBeenCalledWith('octocat', {
      page: undefined,
      perPage: undefined,
      sort: undefined,
      direction: undefined,
      type: undefined,
    });
    expect(response.body).toEqual({
      status: 'success',
      results: 1,
      data: {
        repos,
      },
    });
  });

  it('returns 404 when GitHub user repositories are not found', async () => {
    getGithubUserRepos.mockRejectedValue(new AppError('GitHub user not found.', 404));

    const response = await request(app).get('/api/repos/not-a-real-user/repos').expect(404);

    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBe('GitHub user not found.');
  });

  it('passes sort and page params to the service', async () => {
    getGithubUserRepos.mockResolvedValue([]);

    await request(app)
      .get('/api/repos/octocat/repos?page=2&perPage=10&sort=stars&direction=asc&type=all')
      .expect(200);

    expect(getGithubUserRepos).toHaveBeenCalledWith('octocat', {
      page: '2',
      perPage: '10',
      sort: 'stars',
      direction: 'asc',
      type: 'all',
    });
  });
});
