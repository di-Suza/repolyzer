import { useGetUserReposQuery } from '../githubApi';
import RepoCard from './RepoCard';
import SkeletonCard from '../../../shared/components/SkeletonCard';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const PER_PAGE = 30;

const RepoList = ({ username, sort, page, onLoadMore }) => {
  const { data, isLoading, isFetching, error } = useGetUserReposQuery({ username, sort, page, perPage: PER_PAGE });

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
  const hasMore = (data?.results ?? 0) >= PER_PAGE;

  if (!repos.length) {
    return (
      <p className="rounded-lg border border-(--color-border) bg-(--color-surface) p-5 text-sm font-medium text-(--color-text-muted) shadow-(--shadow-panel)">
        No repositories found.
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {hasMore && (
        <button
          className="h-11 rounded-md border border-(--color-border) bg-(--color-surface) px-4 text-sm font-semibold text-(--color-text-primary) transition hover:border-(--color-border-strong) disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isFetching}
          onClick={onLoadMore}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default RepoList;
