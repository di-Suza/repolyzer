import axios from 'axios';

import { env } from './env.js';

const headers = {
  Accept: 'application/vnd.github.v3+json',
};

if (env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
}

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers,
});

export default githubClient;
