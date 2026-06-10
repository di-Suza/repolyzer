import { useGetUserReposQuery } from '../../githubApi';

const PER_PAGE = 30;

const useRepoList = ({ username, sort, page }) => {
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
  const isLoading = Boolean((isFetching && (!currentData || isStaleRepoData)) || isStaleRepoData);
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
