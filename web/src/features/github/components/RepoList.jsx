import { useGetUserReposQuery } from '../githubApi';
import RepoCard from './RepoCard';
import SkeletonCard from '../../../shared/components/SkeletonCard';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const RepoList = ({ username, sort }) => {
  const { data, isLoading, error } = useGetUserReposQuery({ username, sort });

  if (isLoading) {
    return (
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage error={error} />;

  const repos = data?.data?.repos ?? [];

  if (!repos.length) {
    return (
      <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm font-medium text-[var(--color-text-muted)] shadow-[var(--shadow-panel)]">
        No repositories found.
      </p>
    );
  }

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

export default RepoList;
