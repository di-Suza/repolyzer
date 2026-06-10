import { useState } from 'react';

const RepoCard = ({ repo }) => {
  const [expanded, setExpanded] = useState(false);
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

      {expanded && (
        <div className="mt-4 border-t border-(--color-border) pt-4 text-sm text-(--color-text-muted)">
          <div className="grid gap-2 sm:grid-cols-2">
            <p>Open Issues: {repo.open_issues_count}</p>
            <p>Default Branch: {repo.default_branch}</p>
            <p>Forks: {repo.forks_count}</p>
            <p>Watchers: {repo.watchers_count}</p>
            {repo.license && <p>License: {repo.license.name}</p>}
          </div>

          {repo.topics?.length > 0 && <p className="mt-3">Topics: {repo.topics.join(', ')}</p>}

          <div className="mt-4 flex flex-wrap gap-3">
            {repo.homepage && (
              <a
                className="text-sm font-semibold text-(--color-accent-hover) hover:underline"
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
              >
                Live Demo
              </a>
            )}
            <a
              className="text-sm font-semibold text-(--color-accent-hover) hover:underline"
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      )}

      <button
        className="mt-4 text-sm font-semibold text-(--color-accent-hover) transition hover:underline"
        type="button"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? 'Less' : 'More'}
      </button>
    </div>
  );
};

export default RepoCard;
