const SkeletonCard = () => (
  <div
    aria-hidden="true"
    className="w-full animate-pulse rounded-lg border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-panel)"
  >
    <div className="h-4 w-3/4 rounded-md bg-(--color-surface-muted) shadow-[inset_0_0_0_1px_var(--color-border)]" />
    <div className="mt-3 h-3 w-1/2 rounded-md bg-(--color-surface-muted) shadow-[inset_0_0_0_1px_var(--color-border)]" />
  </div>
);
export default SkeletonCard;
