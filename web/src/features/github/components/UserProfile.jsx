import { useGetUserQuery } from '../githubApi';
import SkeletonProfile from '../../../shared/components/SkeletonProfile';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const UserProfile = ({ username }) => {
  const { currentData, isFetching, error } = useGetUserQuery(username);

  if (isFetching && !currentData) return <SkeletonProfile />;
  if (error) return <ErrorMessage error={error} />;

  const { avatar_url, login, name, bio, followers, following, public_repos } = currentData.data.user;

  return (
    <div className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-panel)">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          className="size-24 rounded-full border border-(--color-border) bg-(--color-surface-muted) object-cover"
          src={avatar_url}
          alt={name ?? login}
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold text-(--color-text-primary)">{name ?? login}</h2>
          <p className="mt-1 text-sm text-(--color-text-muted)">@{login}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-(--color-text-primary)">
            {bio || 'No bio available.'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-app-bg)">
        <span className="border-r border-(--color-border) px-4 py-3 text-center">
          <strong className="block text-lg font-semibold text-(--color-text-primary)">{followers}</strong>
          <span className="text-xs font-medium text-(--color-text-muted)">Followers</span>
        </span>
        <span className="border-r border-(--color-border) px-4 py-3 text-center">
          <strong className="block text-lg font-semibold text-(--color-text-primary)">{following}</strong>
          <span className="text-xs font-medium text-(--color-text-muted)">Following</span>
        </span>
        <span className="px-4 py-3 text-center">
          <strong className="block text-lg font-semibold text-(--color-text-primary)">{public_repos}</strong>
          <span className="text-xs font-medium text-(--color-text-muted)">Repos</span>
        </span>
      </div>
    </div>
  );
};

export default UserProfile;
