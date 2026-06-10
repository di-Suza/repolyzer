import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";
import { addRecentSearch } from "./features/github/githubSlice";

const App = () => {
  const dispatch = useDispatch();
  const recentSearches = useSelector((state) => state.github.recentSearches);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [username, setUsername] = useState("");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);

  const handleSearch = (nextUsername) => {
    const cleanUsername = nextUsername.trim();

    if (!cleanUsername) {
      return;
    }

    setSearchValue(cleanUsername);
    setUsername(cleanUsername);
    setPage(1);
    dispatch(addRecentSearch(cleanUsername));
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] px-4 py-16 text-(--color-text-primary) sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <SearchBar
          value={searchValue}
          onBlur={() => setIsSearchActive(false)}
          onChange={setSearchValue}
          onFocus={() => setIsSearchActive(true)}
          onSearch={handleSearch}
        />
        {isSearchActive && searchValue && recentSearches.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-(--shadow-panel)">
            {recentSearches.map((search) => (
              <button
                className="block w-full px-4 py-3 text-left text-sm font-medium text-(--color-text-primary) transition hover:bg-(--color-surface-muted)"
                key={search}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSearch(search);
                }}
              >
                {search}
              </button>
            ))}
          </div>
        )}
      </div>
      {username && (
        <>
          <UserProfile username={username} />
          <SortDropdown value={sort} onChange={handleSortChange} />
          <RepoList username={username} sort={sort} page={page} onLoadMore={() => setPage((currentPage) => currentPage + 1)} />
        </>
      )}
    </div>
  );
};

export default App;
