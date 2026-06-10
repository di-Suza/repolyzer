import { useGetUserReposQuery } from "../githubApi";
import RepoCard from "./RepoCard";
import SkeletonCard from "../../../shared/components/SkeletonCard";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import LanguageChart from "./LanguageChart";

const PER_PAGE = 30;

const RepoList = ({ username, sort, page, onLoadMore }) => {
  const { currentData, isFetching, error } = useGetUserReposQuery({
    username,
    sort,
    page,
    perPage: PER_PAGE,
  });

  if (isFetching && !currentData) {
    return (
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage error={error} />;

  const repos = currentData?.data?.repos ?? [];
  const hasMore = (currentData?.results ?? 0) >= PER_PAGE;

  if (!repos.length) {
    return (
      <p className="rounded-lg border border-(--color-border) bg-(--color-surface) p-5 text-sm font-medium text-(--color-text-muted) shadow-(--shadow-panel)">
        No repositories found.
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
          {isFetching ? "Loading..." : "Load More"}
        </button>
      )}

      {repos.length > 0 && <LanguageChart repos={repos} />}
    </div>
  );
};

export default RepoList;
