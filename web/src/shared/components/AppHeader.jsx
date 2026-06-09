import { Github } from 'lucide-react';

const statusClasses = {
  checking: 'bg-amber-100 text-amber-800',
  online: 'bg-emerald-100 text-emerald-800',
  offline: 'bg-rose-100 text-rose-800',
};

export function AppHeader({ apiStatus }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-zinc-950 text-white">
            <Github size={19} aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-zinc-950">Repolyzer</span>
        </div>

        <span className={`rounded-md px-2.5 py-1 text-sm font-medium capitalize ${statusClasses[apiStatus]}`}>
          {apiStatus}
        </span>
      </div>
    </header>
  );
}
