import { useMemo } from 'react';

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
  const sortedRepos = useMemo(() => {
    if (sort !== 'stars') {
      return repos;
    }

    // Stars are an app-level sort because GitHub does not support star sorting on this endpoint.
    return [...repos].sort((leftRepo, rightRepo) => {
      const leftStars = leftRepo.stargazers_count ?? 0;
      const rightStars = rightRepo.stargazers_count ?? 0;

      return rightStars - leftStars;
    });
  }, [repos, sort]);
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
    repos: sortedRepos,
  };
};

export default useRepoList;
