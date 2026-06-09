import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import healthRouter from './routes/health.routes.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'repolyzer-api',
      status: 'running',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/health', healthRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode ?? 500;

    res.status(statusCode).json({
      message: err.message ?? 'Internal server error',
    });
  });

  return app;
};
