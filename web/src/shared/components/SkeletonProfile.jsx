const SkeletonProfile = () => (
  <div
    aria-hidden="true"
    className="flex w-full animate-pulse items-center gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-panel)"
  >
    <div className="size-16 shrink-0 rounded-full bg-(--color-surface-muted) shadow-[inset_0_0_0_1px_var(--color-border)]" />
    <div className="min-w-0 flex-1">
      <div className="h-4 w-2/3 rounded-md bg-(--color-surface-muted) shadow-[inset_0_0_0_1px_var(--color-border)]" />
      <div className="mt-3 h-3 w-1/2 rounded-md bg-(--color-surface-muted) shadow-[inset_0_0_0_1px_var(--color-border)]" />
    </div>
  </div>
);
export default SkeletonProfile;
