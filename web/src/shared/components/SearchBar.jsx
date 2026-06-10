const SearchBar = ({ value, onChange, onFocus, onBlur }) => {
  const handleSubmit = (e) => {
    // Search is driven by debounced input changes, so form submit should not reload the page.
    e.preventDefault();
  };

  return (
    <form
      className="flex w-full items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-panel) transition focus-within:border-(--color-border-strong) focus-within:ring-4 focus-within:ring-(--color-focus)"
      onSubmit={handleSubmit}
    >
      <input
        className="h-12 min-w-0 flex-1 rounded-md bg-(--color-app-bg) px-3 text-base font-medium text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder="Enter GitHub username..."
      />
    </form>
  );
};

export default SearchBar;
