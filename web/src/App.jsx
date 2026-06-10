import React, { useState } from "react";
import SearchBar from "./shared/components/SearchBar";

const App = () => {
  const [username, setUsername] = useState("");

  return (
    <div>
      <SearchBar onSearch={setUsername} />

    </div>
  );
};

export default App;
