import axios from 'axios';

import { env } from './env.js';

const headers = {
  Accept: 'application/vnd.github.v3+json',
};

// Keep the token optional so local unauthenticated development still works, just with lower GitHub limits.
if (env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
}

const githubClient = axios.create({
  // Every GitHub service call uses this client so auth/version headers stay consistent.
  baseURL: 'https://api.github.com',
  headers,
});

export default githubClient;
