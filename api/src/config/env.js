import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value, fallback) => {
  // Keep numeric config typed before it reaches server.listen or middleware options.
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  // Centralize defaults so the rest of the API can consume config without touching process.env directly.
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: numberFromEnv(process.env.PORT, 8080),
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
};
