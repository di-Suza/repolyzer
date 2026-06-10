import { useGetUserReposQuery } from '../../githubApi';

const PER_PAGE = 30;

const useRepoList = ({ username, sort, page }) => {
  // Repo pages are merged by RTK Query, so this hook always reads the currently loaded list.
  const { currentData, isFetching, error } = useGetUserReposQuery({
    username,
    sort,
    page,
    perPage: PER_PAGE,
  });
  const repos = currentData?.data?.repos ?? [];
  const firstRepoOwner = repos[0]?.owner?.login?.toLowerCase();
  // Guard against briefly showing the previous user's repos while a new username is loading.
  const isStaleRepoData = Boolean(
    repos.length > 0 && firstRepoOwner !== username.trim().toLowerCase(),
  );
  const isLoading = Boolean((isFetching && (!currentData || isStaleRepoData)) || isStaleRepoData);
  // The API returns the current page size; a full page means another page may exist.
  const hasMore = (currentData?.results ?? 0) >= PER_PAGE;

  return {
    error,
    hasMore,
    isFetching,
    isLoading,
    repos,
  };
};

export default useRepoList;
