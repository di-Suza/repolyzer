import { Github } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md border border-(--color-border) bg-(--color-app-bg) text-(--color-text-primary)">
            <Github size={19} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-base font-semibold text-(--color-text-primary)">Repolyzer</h1>
            <p className="text-xs font-medium text-(--color-text-muted)">GitHub profile and repo analyzer</p>
          </div>
        </div>

        <span className="rounded-md border border-(--color-border) bg-(--color-app-bg) px-2.5 py-1 text-xs font-semibold text-(--color-accent-hover)">
          GitHub API
        </span>
      </div>
    </header>
  );
}
