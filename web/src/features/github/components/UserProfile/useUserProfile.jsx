import { useEffect, useMemo, useRef, useState } from 'react';

import { useGetUserQuery } from '../../githubApi';

const MODAL_CLOSE_DURATION = 180;

const buildLanguageBreakdown = (repos) => {
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
