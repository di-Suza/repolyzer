const SortDropdown = ({ value, onChange }) => (
  <select
    className="h-11 rounded-md border border-(--color-border) bg-(--color-surface) px-3 text-sm font-medium text-(--color-text-primary) shadow-(--shadow-panel) outline-none transition hover:border-(--color-border-strong) focus:border-(--color-border-strong) focus:ring-4 focus:ring-(--color-focus)"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="stars">Stars</option>
    <option value="full_name">Name</option>
    <option value="updated">Last Updated</option>
  </select>
);

export default SortDropdown;
