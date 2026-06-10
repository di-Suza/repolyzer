const SortDropdown = ({ value, onChange }) => (
  <label className="inline-flex w-full items-center justify-between gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-panel) sm:w-auto">
    <span className="whitespace-nowrap px-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
      Sort by
    </span>
    <select
      className="h-9 rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 text-sm font-semibold text-(--color-text-primary) outline-none transition hover:border-(--color-border-strong) focus:border-(--color-border-strong) focus:ring-4 focus:ring-(--color-focus)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {/* Values are GitHub API sort params, so changing them also changes the RTK Query cache key. */}
      <option value="stars">Stars</option>
      <option value="full_name">Name</option>
      <option value="updated">Last Updated</option>
    </select>
  </label>
);

export default SortDropdown;
