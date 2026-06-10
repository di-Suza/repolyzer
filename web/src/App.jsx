import React, { useState } from "react";
import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./features/github/components/UserProfile";
import RepoList from "./features/github/components/RepoList";

const App = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[linear-gradient(180deg,var(--color-surface-muted)_0,var(--color-app-bg)_18rem)] px-4 py-16 text-(--color-text-primary) sm:px-6 lg:px-8">
      <SearchBar onSearch={setUsername} />
      {username && (
        <>
          <UserProfile username={username} />
          <RepoList username={username} />
        </>
      )}
    </div>
  );
};

export default App;
