export const catchAsync = (handler) => (req, res, next) => {
  // Forward rejected controller promises to Express instead of repeating try/catch in every handler.
  Promise.resolve(handler(req, res, next)).catch(next);
};
