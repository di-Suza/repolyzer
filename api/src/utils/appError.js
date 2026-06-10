export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    // The global handler uses these fields to decide status text and production response safety.
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
