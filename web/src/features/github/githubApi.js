import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api',
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (username) => `/users/${username}`,
    }),
    getUserRepos: builder.query({
      query: ({ username, page = 1, perPage = 30, sort = 'updated', direction = 'desc', type = 'owner' }) => ({
        url: `/repos/${username}/repos`,
        params: {
          page,
          perPage,
          sort,
          direction,
          type,
        },
      }),
    }),
    getRepo: builder.query({
      query: ({ owner, username, repo }) => `/repos/${owner ?? username}/${repo}`,
    }),
  }),
});

export const { useGetUserQuery, useGetUserReposQuery, useGetRepoQuery } = githubApi;
