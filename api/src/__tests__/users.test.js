import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '../utils/appError.js';

vi.mock('../services/github.service.js', () => ({
  getGithubUser: vi.fn(),
}));

import { createApp } from '../app.js';
import { getGithubUser } from '../services/github.service.js';

const app = createApp();

afterEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/users/:username', () => {
  it('returns user data for a valid username', async () => {
    const user = {
      login: 'octocat',
      name: 'The Octocat',
      public_repos: 8,
    };

    getGithubUser.mockResolvedValue(user);

    const response = await request(app).get('/api/users/octocat').expect(200);

    expect(getGithubUser).toHaveBeenCalledWith('octocat');
    expect(response.body).toEqual({
      status: 'success',
      data: {
        user,
      },
    });
  });

  it('returns 404 when GitHub user does not exist', async () => {
    getGithubUser.mockRejectedValue(new AppError('GitHub user not found.', 404));

    const response = await request(app).get('/api/users/not-a-real-user').expect(404);

    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBe('GitHub user not found.');
  });
});
