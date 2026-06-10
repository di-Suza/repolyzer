import React, { useState } from "react";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";

const App = () => {
  const [username, setUsername] = useState("");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);

  const handleSearch = (nextUsername) => {
    setUsername(nextUsername);
    setPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] px-4 py-16 text-(--color-text-primary) sm:px-6 lg:px-8">
      <SearchBar onSearch={handleSearch} />
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
