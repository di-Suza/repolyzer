import { env } from '../config/env.js';

const sendDevelopmentError = (err, res) => {
  // In development, expose the full error object so controller/service bugs are quick to debug.
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProductionError = (err, res) => {
  // Operational errors are expected client/runtime failures, so their messages are safe to return.
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unexpected programming errors stay generic in production to avoid leaking internals.
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

export const globalErrorHandler = (err, _req, res, _next) => {
  // Normalize any thrown error before choosing the environment-specific response shape.
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (env.NODE_ENV === 'development') {
    sendDevelopmentError(err, res);
    return;
  }

  sendProductionError(err, res);
};
