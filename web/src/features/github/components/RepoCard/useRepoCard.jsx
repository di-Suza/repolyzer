import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Eye,
  GitBranch,
  GitFork,
  GitPullRequest,
  Globe2,
  HardDrive,
  MessageSquare,
  Star,
} from 'lucide-react';

const MODAL_CLOSE_DURATION = 180;

const numberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatCount = (value = 0) => numberFormatter.format(value ?? 0);

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const formatDate = (value) => {
  if (!value) return 'Unknown';

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatRelativeDate = (value) => {
  if (!value) return 'Unknown';

  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

  return `${Math.floor(diffInDays / 365)} years ago`;
};

const formatRepoSize = (sizeInKb = 0) => {
  if (!sizeInKb) return '0 KB';
  if (sizeInKb < 1024) return `${formatCount(sizeInKb)} KB`;

  const sizeInMb = sizeInKb / 1024;
  return `${sizeInMb >= 10 ? Math.round(sizeInMb) : sizeInMb.toFixed(1)} MB`;
};

const getActivityScore = (pushedAt) => {
  if (!pushedAt) return 12;

  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffInDays <= 7) return 100;
  if (diffInDays <= 30) return 88;
  if (diffInDays <= 90) return 72;
  if (diffInDays <= 180) return 58;
  if (diffInDays <= 365) return 40;

  return 18;
};

const getPopularityScore = ({ forks = 0, stars = 0, watchers = 0 }) =>
  clampScore(Math.log10(stars + forks * 2 + watchers + 1) * 28);

const useRepoCard = (repo) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const { name, description, language, stargazers_count: stargazersCount, updated_at: updatedAt } = repo;
  const updatedDate = updatedAt ? new Date(updatedAt).toLocaleDateString() : 'Unknown';
  const topics = repo.topics?.slice(0, 8) ?? [];
  const cardTopics = topics.slice(0, 2);
  const extraTopicCount = (repo.topics?.length ?? 0) - topics.length;
  const repoSize = formatRepoSize(repo.size);
  const starsLabel = formatCount(stargazersCount);
  const forksLabel = formatCount(repo.forks_count);
  const activityScore = getActivityScore(repo.pushed_at);
  const popularityScore = getPopularityScore({
    forks: repo.forks_count,
    stars: stargazersCount,
    watchers: repo.watchers_count,
  });
  const completenessScore = clampScore(
    [
      description,
      language,
      repo.license,
      repo.homepage,
      repo.topics?.length,
      repo.has_issues,
      repo.has_pull_requests,
    ].filter(Boolean).length * (100 / 7),
  );
  const maintenanceScore = repo.archived || repo.disabled
    ? 14
    : clampScore(
        58 +
          (repo.has_issues ? 10 : 0) +
          (repo.has_pull_requests ? 12 : 0) +
          (repo.has_discussions ? 8 : 0) +
          (repo.open_issues_count > 25 ? -18 : 0),
      );
  const projectScore = clampScore(
    (activityScore + popularityScore + completenessScore + maintenanceScore) / 4,
  );

  const detailItems = [
    { icon: Star, label: 'Stars', value: starsLabel },
    { icon: GitFork, label: 'Forks', value: forksLabel },
    { icon: AlertCircle, label: 'Issues', value: formatCount(repo.open_issues_count) },
    { icon: GitBranch, label: 'Branch', value: repo.default_branch || 'main' },
    { icon: Eye, label: 'Watchers', value: formatCount(repo.watchers_count) },
    { icon: HardDrive, label: 'Size', value: repoSize },
  ];

  const analyzerMetrics = [
    { label: 'Activity', value: activityScore, meta: `Pushed ${formatRelativeDate(repo.pushed_at)}` },
    { label: 'Popularity', value: popularityScore, meta: `${starsLabel} stars` },
    { label: 'Completeness', value: completenessScore, meta: repo.license ? repo.license.name : 'No license' },
    { label: 'Maintenance', value: maintenanceScore, meta: repo.archived ? 'Archived' : 'Active repo' },
  ];

  const statusBadges = [
    repo.visibility || 'public',
    repo.fork ? 'Fork' : 'Source',
    repo.archived ? 'Archived' : 'Active',
    repo.is_template ? 'Template' : null,
    repo.has_pages ? 'Pages' : null,
  ].filter(Boolean);

  const capabilityItems = [
    { icon: AlertCircle, label: 'Issues', active: repo.has_issues },
    { icon: GitPullRequest, label: 'Pull requests', active: repo.has_pull_requests },
    { icon: MessageSquare, label: 'Discussions', active: repo.has_discussions },
    { icon: BookOpen, label: 'Wiki', active: repo.has_wiki },
    { icon: Globe2, label: 'Pages', active: repo.has_pages },
    { icon: GitFork, label: 'Forking', active: repo.allow_forking },
  ];

  const timelineItems = [
    { label: 'Created', value: formatDate(repo.created_at), meta: formatRelativeDate(repo.created_at) },
    { label: 'Last pushed', value: formatDate(repo.pushed_at), meta: formatRelativeDate(repo.pushed_at) },
    { label: 'Updated', value: formatDate(updatedAt), meta: formatRelativeDate(updatedAt) },
  ];

  const repoFacts = [
    { label: 'Primary language', value: language || 'Unknown' },
    { label: 'Visibility', value: repo.visibility || (repo.private ? 'private' : 'public') },
    { label: 'Default branch', value: repo.default_branch || 'main' },
    { label: 'Pull policy', value: repo.pull_request_creation_policy || 'Default' },
  ];

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDetails = () => {
    clearCloseTimer();
    setIsClosing(false);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    if (!isDetailsOpen || isClosing) return;

    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsDetailsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, MODAL_CLOSE_DURATION);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!isDetailsOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeDetails();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDetailsOpen, isClosing]);

  return {
    analyzerMetrics,
    capabilityItems,
    cardTopics,
    closeDetails,
    description,
    detailItems,
    extraTopicCount,
    forksLabel,
    handleCardKeyDown,
    homepage: repo.homepage,
    htmlUrl: repo.html_url,
    isClosing,
    isDetailsOpen,
    language,
    licenseName: repo.license?.name || 'No license',
    name,
    openDetails,
    projectScore,
    repoFacts,
    starsLabel,
    statusBadges,
    timelineItems,
    topics,
    updatedDate,
  };
};

export default useRepoCard;
