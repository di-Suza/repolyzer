import { useState } from 'react';

import { useGetUserQuery } from '../githubApi';
import SkeletonProfile from '../../../shared/components/SkeletonProfile';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const UserProfile = ({ username }) => {
  const [hasChartError, setHasChartError] = useState(false);
  const { currentData, isFetching, error } = useGetUserQuery(username);

  if (isFetching && !currentData) return <SkeletonProfile />;
  if (error) return <ErrorMessage error={error} />;

  const { avatar_url, login, name, bio, followers, following, public_repos } = currentData.data.user;

  return (
    <section className="w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-(--shadow-panel)">
      <div className="h-20 border-b border-(--color-border) bg-[linear-gradient(135deg,var(--color-surface-muted),var(--color-app-bg))]" />

      <div className="p-5 pt-0">
        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <img
              className="size-24 rounded-full border-4 border-(--color-surface) bg-(--color-surface-muted) object-cover shadow-[0_0_0_1px_var(--color-border)]"
              src={avatar_url}
              alt={name ?? login}
            />

            <div className="min-w-0 pb-1">
              <h2 className="truncate text-2xl font-semibold text-(--color-text-primary)">{name ?? login}</h2>
              <p className="mt-1 text-sm font-medium text-(--color-text-muted)">@{login}</p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 py-1.5 text-xs font-semibold text-(--color-accent-hover)">
            Profile Analyzer
          </span>
        </div>

        <p className="mt-5 max-w-4xl rounded-lg border border-(--color-border) bg-(--color-app-bg) p-4 text-sm leading-6 text-(--color-text-primary)">
          {bio || 'No bio available.'}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) px-4 py-3">
            <span className="text-xs font-medium text-(--color-text-muted)">Followers</span>
            <strong className="mt-1 block text-2xl font-semibold text-(--color-text-primary)">{followers}</strong>
          </div>
          <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) px-4 py-3">
            <span className="text-xs font-medium text-(--color-text-muted)">Following</span>
            <strong className="mt-1 block text-2xl font-semibold text-(--color-text-primary)">{following}</strong>
          </div>
          <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) px-4 py-3">
            <span className="text-xs font-medium text-(--color-text-muted)">Repositories</span>
            <strong className="mt-1 block text-2xl font-semibold text-(--color-text-primary)">{public_repos}</strong>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-app-bg)">
          <div className="border-b border-(--color-border) px-4 py-3">
            <h3 className="text-sm font-semibold text-(--color-text-primary)">Contribution Activity</h3>
          </div>
          <div className="p-3">
            {hasChartError ? (
              <p className="py-8 text-center text-sm font-medium text-(--color-text-muted)">
                Contribution chart is not available right now.
              </p>
            ) : (
              <img
                className="block h-32 w-full object-contain"
                src={`https://ghchart.rshah.org/238636/${login}`}
                alt={`${login} contribution chart`}
                onError={() => setHasChartError(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
