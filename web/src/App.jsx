import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./shared/components/SearchBar";
import SkeletonProfile from "./shared/components/SkeletonProfile";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";
import { addRecentSearch } from "./features/github/githubSlice";
import { githubApi, useGetUserQuery } from "./features/github/githubApi";
import useDebounce from "./shared/hooks/useDebounce";
import { AppHeader } from "./shared/components/AppHeader";

const SEARCH_DEBOUNCE_DELAY = 700;
const REPOS_PER_PAGE = 30;

const App = () => {
  const dispatch = useDispatch();
  const recentSearches = useSelector((state) => state.github.recentSearches);
  // Keep raw input separate from the committed username so debounce can control when queries run.
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [username, setUsername] = useState("");
  // Repo query state is owned here because sort/page affect both the list and language modal cache view.
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);
  const debouncedSearchValue = useDebounce(searchValue, SEARCH_DEBOUNCE_DELAY);
  // The top-level user query decides which profile/repo sections are allowed to render.
  const {
    currentData: currentUserData,
    error: userError,
    isError: isUserError,
    isFetching: isUserFetching,
  } = useGetUserQuery(username, {
    skip: !username,
  });
  // Read the current RTK Query repo cache without firing another request for the language modal.
  const loadedReposResult = useSelector(
    githubApi.endpoints.getUserRepos.select({
      username,
      sort,
      page,
      perPage: REPOS_PER_PAGE,
    }),
  );
  const loadedRepos = loadedReposResult?.data?.data?.repos ?? [];

  // Commit a debounced username search, reset pagination, and persist the search shortcut.
  const applySearch = (nextUsername) => {
    const cleanUsername = nextUsername.trim();

    if (!cleanUsername) {
      setUsername("");
      return;
    }

    setUsername(cleanUsername);
    setPage(1);
    dispatch(addRecentSearch(cleanUsername));
  };

  useEffect(() => {
    applySearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  // Once fresh profile data arrives, hide the recent-search dropdown so it does not cover the profile card.
  useEffect(() => {
    if (currentUserData && !isUserFetching) {
      setIsSearchActive(false);
    }
  }, [currentUserData, isUserFetching]);

  const handleSortChange = (nextSort) => {
    // Sorting changes the repo cache key, so pagination must start over from page one.
    setSort(nextSort);
    setPage(1);
  };

  const handleSearchChange = (nextValue) => {
    setSearchValue(nextValue);
    setIsSearchActive(true);
  };

  const shouldShowRecentSearches = isSearchActive && searchValue.trim() && recentSearches.length > 0;
  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const currentUserLogin = currentUserData?.data?.user?.login?.toLowerCase();
  // Treat cached data as usable only when it belongs to the username currently being shown.
  const hasFreshUserData = Boolean(username && currentUserLogin === normalizedUsername);
  const isWaitingForDebouncedSearch = Boolean(
    normalizedSearchValue && normalizedSearchValue !== normalizedUsername,
  );
  // Show skeletons while debounce is pending or while a new username is replacing stale cached data.
  const shouldShowSearchLoading = Boolean(
    isWaitingForDebouncedSearch || (username && isUserFetching && !hasFreshUserData),
  );
  const isUserNotFound = !shouldShowSearchLoading && isUserError && userError?.status === 404;
  const canShowUserProfile = username && !shouldShowSearchLoading && !isUserError;
  const canShowRepos = username && hasFreshUserData && !shouldShowSearchLoading && !isUserError;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] text-(--color-text-primary)">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative w-full">
          <SearchBar
            value={searchValue}
            onBlur={() => setIsSearchActive(false)}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchActive(true)}
          />
          {shouldShowRecentSearches && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface)/80 shadow-(--shadow-panel) backdrop-blur-md">
              {recentSearches.map((search) => (
                <button
                  className="block w-full px-4 py-3 text-left text-sm font-medium text-(--color-text-primary) transition hover:bg-(--color-surface-muted)"
                  key={search}
                  type="button"
                  onMouseDown={(event) => {
                    // Use mouse down so choosing a recent search happens before input blur hides the dropdown.
                    event.preventDefault();
                    setSearchValue(search);
                    applySearch(search);
                  }}
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>

        {!username && (
          <section className="rounded-lg border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-(--shadow-panel)">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-(--color-border) bg-(--color-app-bg) text-(--color-accent-hover)">
              <span className="text-2xl font-semibold">GH</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-(--color-text-primary)">Search any GitHub profile</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-(--color-text-muted)">
              Type a username to analyze profile details, repositories, language activity, and contribution patterns.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 py-1.5 text-xs font-semibold text-(--color-text-muted)">
                Profiles
              </span>
              <span className="rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 py-1.5 text-xs font-semibold text-(--color-text-muted)">
                Repositories
              </span>
              <span className="rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 py-1.5 text-xs font-semibold text-(--color-text-muted)">
                Languages
              </span>
            </div>
          </section>
        )}

        {shouldShowSearchLoading && <SkeletonProfile />}

        {isUserNotFound && (
          <section className="rounded-lg border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-(--shadow-panel)">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-(--color-border) bg-(--color-app-bg) text-(--color-accent-hover)">
              <span className="text-2xl font-semibold">?</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-(--color-text-primary)">GitHub user not found</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-(--color-text-muted)">
              We could not find a GitHub profile for <span className="font-semibold text-(--color-text-primary)">{username}</span>.
              Check the spelling or pick a recent search.
            </p>
          </section>
        )}

        {canShowUserProfile && <UserProfile username={username} repos={loadedRepos} />}

        {canShowRepos && (
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-(--color-text-primary)">Repositories</h2>
                <p className="mt-1 text-sm text-(--color-text-muted)">Explore public repositories for @{username}</p>
              </div>
              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>
            <RepoList
              username={username}
              sort={sort}
              page={page}
              onLoadMore={() => setPage((currentPage) => currentPage + 1)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
