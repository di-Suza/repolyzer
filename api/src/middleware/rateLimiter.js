import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  // Keep GitHub proxy usage modest and reduce accidental rate-limit bursts from the frontend.
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests, please try again later.',
  },
});
