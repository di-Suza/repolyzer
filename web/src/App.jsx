import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";
import { addRecentSearch } from "./features/github/githubSlice";
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

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] text-(--color-text-primary)">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-2xl">
          <SearchBar
            value={searchValue}
            onBlur={() => setIsSearchActive(false)}
            onChange={setSearchValue}
            onFocus={() => setIsSearchActive(true)}
          />
          {isSearchActive && searchValue && recentSearches.length > 0 && (
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

        {username && (
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
            <div className="space-y-4">
              <UserProfile username={username} />
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
