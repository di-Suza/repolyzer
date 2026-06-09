import { env } from '../config/env.js';

const sendDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProductionError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

export const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (env.NODE_ENV === 'development') {
    sendDevelopmentError(err, res);
    return;
  }

  sendProductionError(err, res);
};
