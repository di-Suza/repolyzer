import { useEffect, useMemo, useRef, useState } from 'react';

import { useGetUserQuery } from '../../githubApi';

const MODAL_CLOSE_DURATION = 180;

const buildLanguageBreakdown = (repos) => {
  // The modal charts currently loaded repos by primary language, not by per-file language bytes.
  const counts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }

    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value);
};

const useUserProfile = ({ username, repos = [] }) => {
  // These states control local UI concerns that should not leak into global Redux state.
  const [hasChartError, setHasChartError] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLanguageModalClosing, setIsLanguageModalClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const { currentData, isFetching, error } = useGetUserQuery(username);
  const languageBreakdown = useMemo(() => buildLanguageBreakdown(repos), [repos]);
  const totalLanguageRepos = languageBreakdown.reduce((total, language) => total + language.value, 0);
  const user = currentData?.data?.user;
  const isStaleProfile = Boolean(
    user && user.login?.toLowerCase() !== username.trim().toLowerCase(),
  );
  // Prevent old cached profile data from rendering while a different username is being fetched.
  const isLoading = Boolean(
    (isFetching && (!user || isStaleProfile)) || (!error && !user) || isStaleProfile,
  );

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openLanguageModal = () => {
    clearCloseTimer();
    setIsLanguageModalClosing(false);
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    if (!isLanguageModalOpen || isLanguageModalClosing) return;

    // Delay unmounting until the modal's close animation has completed.
    setIsLanguageModalClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsLanguageModalOpen(false);
      setIsLanguageModalClosing(false);
      closeTimerRef.current = null;
    }, MODAL_CLOSE_DURATION);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!isLanguageModalOpen) return undefined;

    // The page underneath should stay fixed while the modal itself remains scrollable.
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeLanguageModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isLanguageModalOpen, isLanguageModalClosing]);

  return {
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
  };
};

export default useUserProfile;
