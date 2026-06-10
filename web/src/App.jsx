import React, { useState } from "react";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";
import SortDropdown from "./shared/components/SortDropdown";

const App = () => {
  const [username, setUsername] = useState("");
  const [sort, setSort] = useState("stars");

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] px-4 py-16 text-(--color-text-primary) sm:px-6 lg:px-8">
      <SearchBar onSearch={setUsername} />
      {username && (
        <>
          <UserProfile username={username} />
          <SortDropdown value={sort} onChange={setSort} />
          <RepoList username={username} sort={sort} />
        </>
      )}
    </div>
  );
};

export default App;
