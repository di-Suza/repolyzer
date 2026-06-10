import { createPortal } from 'react-dom';
import { CalendarDays, ExternalLink, GitBranch, GitFork, Info, ShieldCheck, Star, X } from 'lucide-react';

import useRepoCard from './useRepoCard';

const RepoCard = ({ repo }) => {
  const {
    analyzerMetrics,
    capabilityItems,
    cardTopics,
    closeDetails,
    description,
    detailItems,
    extraTopicCount,
    forksLabel,
    handleCardKeyDown,
    homepage,
    htmlUrl,
    isClosing,
    isDetailsOpen,
    language,
    licenseName,
    name,
    openDetails,
    projectScore,
    repoFacts,
    starsLabel,
    statusBadges,
    timelineItems,
    topics,
    updatedDate,
  } = useRepoCard(repo);

  return (
    <>
      <div
        aria-expanded={isDetailsOpen}
        className="group relative flex min-h-55 w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-panel) transition duration-200 hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-muted) focus:outline-none focus:ring-4 focus:ring-(--color-focus)"
        role="button"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={handleCardKeyDown}
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-(--color-accent)" aria-hidden="true" />

        <div className="flex items-start gap-3 pt-1">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-(--color-border) bg-(--color-app-bg) text-(--color-accent-hover) transition group-hover:border-(--color-border-strong)">
            <GitBranch className="size-5" />
          </div>

          <div className="min-w-0">
            <h3 className="mt-1 truncate text-base font-semibold text-(--color-text-primary)">
              {name}
            </h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-(--color-text-muted)">
          {description || 'No description added for this repository yet.'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {cardTopics.map((topic) => (
            <span
              className="max-w-24 truncate rounded-full border border-(--color-border) bg-(--color-app-bg) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-muted)"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-(--color-border) pt-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-3 text-xs font-semibold text-(--color-text-muted)">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 text-(--color-accent-hover)" />
                {starsLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitFork className="size-3.5 text-(--color-accent-hover)" />
                {forksLabel}
              </span>
            </div>
          </div>

          <button
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 text-xs font-semibold text-(--color-text-primary) transition hover:border-(--color-border-strong) hover:text-(--color-accent-hover)"
            type="button"
            onClick={(event) => {
              // The whole card opens details, so the inner button must not trigger that handler twice.
              event.stopPropagation();
              openDetails();
            }}
          >
            <Info className="size-3.5" />
            Details
          </button>
        </div>
      </div>

      {isDetailsOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 grid place-items-center bg-(--color-app-bg)/75 px-4 py-6 backdrop-blur-md ${
              isClosing ? 'repo-backdrop-exit' : 'repo-backdrop-enter'
            }`}
            onClick={closeDetails}
          >
            <div
              className={`relative max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-lg border border-(--color-border-strong) bg-(--color-surface) shadow-[0_30px_110px_rgb(0_0_0/65%)] ${
                isClosing ? 'repo-modal-exit' : 'repo-modal-enter'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-(--color-border) p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    {statusBadges.map((status) => (
                      <span
                        className="rounded-full border border-(--color-border) bg-(--color-app-bg) px-2.5 py-1 text-[11px] font-semibold capitalize text-(--color-text-muted)"
                        key={status}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 wrap-break-word text-2xl font-semibold text-(--color-text-primary)">
                    {name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
                    {description || 'No description added for this repository yet.'}
                  </p>
                </div>

                <button
                  aria-label="Close repo details"
                  className="grid size-9 shrink-0 place-items-center rounded-md border border-(--color-border) bg-(--color-app-bg) text-(--color-text-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text-primary)"
                  type="button"
                  onClick={closeDetails}
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {detailItems.map(({ icon: Icon, label, value }) => (
                      <div
                        className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-3"
                        key={label}
                      >
                        <Icon className="size-4 text-(--color-accent-hover)" />
                        <p className="mt-3 truncate text-sm font-semibold text-(--color-text-primary)">
                          {value}
                        </p>
                        <p className="mt-1 text-xs font-medium text-(--color-text-muted)">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-(--color-text-primary)">
                          Project signals
                        </p>
                        <p className="mt-1 text-xs text-(--color-text-muted)">
                          Derived from stars, activity, license, topics, and repo settings.
                        </p>
                      </div>
                      <span className="rounded-full bg-(--color-accent)/15 px-3 py-1 text-xs font-semibold text-(--color-accent-hover)">
                        {projectScore}/100
                      </span>
                    </div>

                    <div className="mt-4 space-y-4">
                      {analyzerMetrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold text-(--color-text-primary)">
                              {metric.label}
                            </span>
                            <span className="text-(--color-text-muted)">
                              {metric.meta}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-surface-muted)">
                            <div
                              className="h-full rounded-full bg-(--color-accent)"
                              style={{ width: `${metric.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4">
                      <p className="text-sm font-semibold text-(--color-text-primary)">
                        Repo facts
                      </p>
                      <div className="mt-4 grid gap-3">
                        {repoFacts.map((fact) => (
                          <div className="flex items-center justify-between gap-3" key={fact.label}>
                            <span className="text-xs font-medium text-(--color-text-muted)">
                              {fact.label}
                            </span>
                            <span className="max-w-36 truncate text-right text-xs font-semibold capitalize text-(--color-text-primary)">
                              {fact.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4">
                      <p className="text-sm font-semibold text-(--color-text-primary)">
                        Feature switches
                      </p>
                      <div className="mt-4 grid gap-2">
                        {capabilityItems.map(({ active, icon: Icon, label }) => (
                          <div
                            className="flex items-center justify-between gap-3 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2"
                            key={label}
                          >
                            <span className="inline-flex min-w-0 items-center gap-2 text-xs font-medium text-(--color-text-muted)">
                              <Icon className="size-3.5 shrink-0 text-(--color-accent-hover)" />
                              {label}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                active
                                  ? 'bg-(--color-accent)/15 text-(--color-accent-hover)'
                                  : 'bg-(--color-surface-muted) text-(--color-text-muted)'
                              }`}
                            >
                              {active ? 'On' : 'Off'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4 text-center">
                    <div
                      className="mx-auto grid size-28 place-items-center rounded-full"
                      style={{
                        background: `conic-gradient(var(--color-accent) ${
                          projectScore * 3.6
                        }deg, var(--color-surface-muted) 0deg)`,
                      }}
                    >
                      <div className="grid size-22 place-items-center rounded-full bg-(--color-app-bg)">
                        <div>
                          <p className="text-2xl font-semibold text-(--color-text-primary)">
                            {projectScore}
                          </p>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-text-muted)">
                            Score
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-(--color-text-primary)">
                      Repository pulse
                    </p>
                    <p className="mt-1 text-xs leading-5 text-(--color-text-muted)">
                      A quick read of popularity, freshness, and completeness.
                    </p>
                  </div>

                  <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
                      <CalendarDays className="size-4 text-(--color-accent-hover)" />
                      Timeline
                    </p>
                    <div className="mt-4 space-y-3">
                      {timelineItems.map((item) => (
                        <div className="flex items-start gap-3" key={item.label}>
                          <span className="mt-1 size-2 rounded-full bg-(--color-accent)" />
                          <div>
                            <p className="text-xs font-semibold text-(--color-text-primary)">
                              {item.label}
                            </p>
                            <p className="text-xs text-(--color-text-muted)">
                              {item.value} - {item.meta}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border border-(--color-border) bg-(--color-app-bg) p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
                      <ShieldCheck className="size-4 text-(--color-accent-hover)" />
                      Metadata
                    </p>
                    <div className="mt-4 space-y-3">
                      <p className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-(--color-text-muted)">License</span>
                        <span className="max-w-40 truncate font-semibold text-(--color-text-primary)">
                          {licenseName}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-(--color-text-muted)">Primary language</span>
                        <span className="inline-flex items-center gap-2 font-semibold text-(--color-text-primary)">
                          <span className="size-2 rounded-full bg-(--color-accent)" />
                          {language || 'Unknown'}
                        </span>
                      </p>
                    </div>

                    {topics.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {topics.map((topic) => (
                          <span
                            className="rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-xs font-semibold text-(--color-text-muted)"
                            key={topic}
                          >
                            {topic}
                          </span>
                        ))}
                        {extraTopicCount > 0 && (
                          <span className="rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-xs font-semibold text-(--color-text-muted)">
                            +{extraTopicCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </aside>
              </div>

              <div className="flex flex-col gap-3 border-t border-(--color-border) p-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  {homepage && (
                    <a
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-(--color-border) bg-(--color-app-bg) px-4 text-sm font-semibold text-(--color-text-primary) transition hover:border-(--color-border-strong) hover:text-(--color-accent-hover)"
                      href={homepage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      Live demo
                    </a>
                  )}
                  <a
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-(--color-accent) px-4 text-sm font-semibold text-white transition hover:bg-(--color-accent-hover)"
                    href={htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    View on GitHub
                  </a>
                </div>

                <p className="text-right text-xs font-medium text-(--color-text-muted)">
                  Updated {updatedDate}
                </p>
              </div>

              <span
                className="pointer-events-none absolute -top-3 left-1/2 size-6 -translate-x-1/2 rotate-45 border-l border-t border-(--color-border-strong) bg-(--color-surface)"
                aria-hidden="true"
              >
                {' '}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RepoCard;
