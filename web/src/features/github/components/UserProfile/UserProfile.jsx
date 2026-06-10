import { createPortal } from 'react-dom';
import { BarChart3, Code2, X } from 'lucide-react';

import SkeletonProfile from '../../../../shared/components/SkeletonProfile';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import LanguageChart from '../LanguageChart';
import useUserProfile from './useUserProfile';

const UserProfile = ({ username, repos = [] }) => {
  const {
    closeLanguageModal,
    error,
    hasChartError,
    isLanguageModalClosing,
    isLanguageModalOpen,
    isLoading,
    languageBreakdown,
    openLanguageModal,
    setHasChartError,
    totalLanguageRepos,
    user,
  } = useUserProfile({ username, repos });

  if (isLoading) return <SkeletonProfile />;
  if (error) return <ErrorMessage error={error} />;

  const { avatar_url, login, name, bio, followers, following, public_repos } = user;

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

          <div className="flex w-fit flex-col gap-2 sm:items-end">
            <span className="inline-flex items-center rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 py-1.5 text-xs font-semibold text-(--color-accent-hover)">
              Profile Analyzer
            </span>
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-(--color-border) bg-(--color-app-bg) px-3 text-xs font-semibold text-(--color-text-primary) transition hover:border-(--color-border-strong) hover:text-(--color-accent-hover)"
              type="button"
              onClick={openLanguageModal}
            >
              <BarChart3 className="size-4" />
              Languages
            </button>
          </div>
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

      {isLanguageModalOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 grid place-items-center bg-(--color-app-bg)/75 px-4 py-6 backdrop-blur-md ${
              isLanguageModalClosing ? 'repo-backdrop-exit' : 'repo-backdrop-enter'
            }`}
            onClick={closeLanguageModal}
          >
            <div
              className={`relative max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-lg border border-(--color-border-strong) bg-(--color-surface) shadow-[0_30px_110px_rgb(0_0_0/65%)] ${
                isLanguageModalClosing ? 'repo-modal-exit' : 'repo-modal-enter'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-(--color-border) p-5">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-(--color-accent-hover)">
                    <Code2 className="size-4" />
                    Language analyzer
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-(--color-text-primary)">
                    @{login} language breakdown
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-(--color-text-muted)">
                    Based on the primary language field from currently loaded repositories.
                  </p>
                </div>

                <button
                  aria-label="Close language analyzer"
                  className="grid size-9 shrink-0 place-items-center rounded-md border border-(--color-border) bg-(--color-app-bg) text-(--color-text-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text-primary)"
                  type="button"
                  onClick={closeLanguageModal}
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5">
                {languageBreakdown.length ? (
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <LanguageChart repos={repos} />

                    <aside className="space-y-4">
                      <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) p-4">
                        <p className="text-sm font-semibold text-(--color-text-primary)">
                          Snapshot
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-md border border-(--color-border) bg-(--color-surface) p-3">
                            <span className="text-xs text-(--color-text-muted)">Repos scanned</span>
                            <strong className="mt-1 block text-xl text-(--color-text-primary)">
                              {repos.length}
                            </strong>
                          </div>
                          <div className="rounded-md border border-(--color-border) bg-(--color-surface) p-3">
                            <span className="text-xs text-(--color-text-muted)">Languages</span>
                            <strong className="mt-1 block text-xl text-(--color-text-primary)">
                              {languageBreakdown.length}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) p-4">
                        <p className="text-sm font-semibold text-(--color-text-primary)">
                          Top languages
                        </p>
                        <div className="mt-4 space-y-4">
                          {languageBreakdown.slice(0, 6).map((language) => {
                            const percentage = Math.round((language.value / totalLanguageRepos) * 100);

                            return (
                              <div key={language.name}>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                  <span className="font-semibold text-(--color-text-primary)">
                                    {language.name}
                                  </span>
                                  <span className="text-(--color-text-muted)">
                                    {language.value} repos - {percentage}%
                                  </span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-surface-muted)">
                                  <div
                                    className="h-full rounded-full bg-(--color-accent)"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : (
                  <div className="rounded-lg border border-(--color-border) bg-(--color-app-bg) p-6 text-center">
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      No language data found.
                    </p>
                    <p className="mt-2 text-sm text-(--color-text-muted)">
                      Load repositories first, or try a profile with repositories that have a primary language.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default UserProfile;
