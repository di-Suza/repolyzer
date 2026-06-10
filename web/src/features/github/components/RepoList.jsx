import { useGetUserReposQuery } from "../githubApi";
import RepoCard from "./RepoCard";
import SkeletonCard from "../../../shared/components/SkeletonCard";
import ErrorMessage from "../../../shared/components/ErrorMessage";

const PER_PAGE = 30;

const RepoList = ({ username, sort, page, onLoadMore }) => {
  const { currentData, isFetching, error } = useGetUserReposQuery({
    username,
    sort,
    page,
    perPage: PER_PAGE,
  });
  const repos = currentData?.data?.repos ?? [];
  const firstRepoOwner = repos[0]?.owner?.login?.toLowerCase();
  const isStaleRepoData = Boolean(
    repos.length > 0 && firstRepoOwner !== username.trim().toLowerCase(),
  );

  if ((isFetching && (!currentData || isStaleRepoData)) || isStaleRepoData) {
    return (
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage error={error} />;

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
        <div className="flex justify-center pt-2">
          <button
            className="inline-flex h-11 min-w-40 items-center justify-center rounded-md border border-(--color-border) bg-(--color-accent) px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(35_134_54/20%)] transition hover:-translate-y-0.5 hover:border-(--color-accent-hover) hover:bg-(--color-accent-hover) disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            type="button"
            disabled={isFetching}
            onClick={onLoadMore}
          >
            {isFetching ? "Loading repos..." : "Load more repositories"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RepoList;
