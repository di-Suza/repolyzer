import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form
      className="flex w-full max-w-2xl items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-panel) transition focus-within:border-(--color-border-strong) focus-within:ring-4 focus-within:ring-(--color-focus)"
      onSubmit={handleSubmit}
    >
      <input
        className="h-12 min-w-0 flex-1 rounded-md bg-(--color-app-bg) px-3 text-base font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter GitHub username..."
      />
      <button
        className="h-12 shrink-0 rounded-md bg-(--color-accent) px-5 text-sm font-semibold text-white transition hover:bg-(--color-accent-hover) focus:outline-none focus:ring-2 focus:ring-(--color-focus) focus:ring-offset-2 focus:ring-offset-(--color-surface)"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
