import { cn } from '../lib/cn.js';

export function Button({ className, type = 'button', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      type={type}
      {...props}
    />
  );
}
