import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: numberFromEnv(process.env.PORT, 8080),
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};
