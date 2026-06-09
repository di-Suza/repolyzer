import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import healthRouter from './routes/health.routes.js';
import apiRouter from './routes/index.js';
import { AppError } from './utils/appError.js';

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

  app.use('/api', apiRateLimiter);
  app.use('/api/health', healthRouter);
  app.use('/api', apiRouter);

  app.use((req, _res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
  });

  app.use(globalErrorHandler);

  return app;
};
