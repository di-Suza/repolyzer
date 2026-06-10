import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";
import { addRecentSearch } from "./features/github/githubSlice";
import { useGetUserQuery } from "./features/github/githubApi";
import useDebounce from "./shared/hooks/useDebounce";
import { AppHeader } from "./shared/components/AppHeader";

const SEARCH_DEBOUNCE_DELAY = 700;

const App = () => {
  const dispatch = useDispatch();
  const recentSearches = useSelector((state) => state.github.recentSearches);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [username, setUsername] = useState("");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);
  const debouncedSearchValue = useDebounce(searchValue, SEARCH_DEBOUNCE_DELAY);
  const {
    currentData: currentUserData,
    isError: isUserError,
    isFetching: isUserFetching,
  } = useGetUserQuery(username, {
    skip: !username,
  });

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

  useEffect(() => {
    if (currentUserData && !isUserFetching) {
      setIsSearchActive(false);
    }
  }, [currentUserData, isUserFetching]);

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleSearchChange = (nextValue) => {
    setSearchValue(nextValue);
    setIsSearchActive(true);
  };

  const shouldShowRecentSearches =
    searchValue.trim() && recentSearches.length > 0 && (isSearchActive || isUserError);

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

        {username && (
          <div className="flex w-full flex-col gap-6">
            <UserProfile username={username} />
            <SortDropdown value={sort} onChange={handleSortChange} />
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
