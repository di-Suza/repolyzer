const getErrorMessage = (error) => {
  if (error?.status === 404) return 'GitHub user not found.';
  if (error?.status === 429) return 'GitHub rate limit exceeded. Try after a minute.';
  return 'Something went wrong. Please try again.';
};

const ErrorMessage = ({ error }) => (
  <div className="error-box">
    <p>{getErrorMessage(error)}</p>
  </div>
);

export default ErrorMessage;