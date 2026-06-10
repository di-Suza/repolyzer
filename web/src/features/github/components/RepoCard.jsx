const RepoCard = ({ repo }) => {
  const { name, description, language, stargazers_count, updated_at } = repo;

  return (
    <div className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-panel) transition hover:border-(--color-border-strong)">
      <h3 className="truncate text-lg font-semibold text-(--color-text-primary)">{name}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-(--color-text-muted)">
        {description || 'No description'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-(--color-text-muted)">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-(--color-accent)" />
          {language || 'Unknown'}
        </span>
        <span>{stargazers_count} Stars</span>
        <span>Updated {new Date(updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default RepoCard;
