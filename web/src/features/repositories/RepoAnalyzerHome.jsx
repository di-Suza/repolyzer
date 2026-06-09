import { Activity, Github, GitPullRequest, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AppHeader } from '../../shared/components/AppHeader.jsx';
import { env } from '../../shared/lib/env.js';
import { Button } from '../../shared/ui/Button.jsx';
import { Input } from '../../shared/ui/Input.jsx';

const metricCards = [
  { label: 'Repo health', value: 'Ready', icon: ShieldCheck },
  { label: 'Signals', value: '0', icon: Activity },
  { label: 'Pull requests', value: '0', icon: GitPullRequest },
];

export function RepoAnalyzerHome() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    let isActive = true;

    fetch(`${env.VITE_API_BASE_URL}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Health check failed');
        }

        return response.json();
      })
      .then(() => {
        if (isActive) {
          setApiStatus('online');
        }
      })
      .catch(() => {
        if (isActive) {
          setApiStatus('offline');
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-950">
      <AppHeader apiStatus={apiStatus} />

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                <Github size={22} aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">Repository Analyzer</h1>
                <p className="mt-1 text-sm text-zinc-500">GitHub repository workspace</p>
              </div>
            </div>
          </div>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <Input
              aria-label="GitHub repository URL"
              placeholder="https://github.com/owner/repository"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
            />
            <Button type="submit">
              <Search size={18} aria-hidden="true" />
              Analyze
            </Button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {metricCards.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                    <Icon className="text-teal-700" size={18} aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-zinc-950">{item.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Workspace</h2>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">API</dt>
              <dd className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-medium capitalize text-zinc-800">
                {apiStatus}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Web</dt>
              <dd className="rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-800">ready</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-zinc-500">Port</dt>
              <dd className="font-mono text-sm text-zinc-800">8080</dd>
            </div>
          </dl>
        </aside>
      </main>
    </div>
  );
}
