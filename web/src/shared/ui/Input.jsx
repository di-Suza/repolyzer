import { cn } from '../lib/cn.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-11 min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100',
        className,
      )}
      {...props}
    />
  );
}
