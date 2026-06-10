import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const githubApi = createApi({
  reducerPath: "githubApi",
  // All frontend calls go through the Express API, keeping GitHub tokens/server concerns out of the browser.
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080/api",
  }),
  endpoints: (builder) => ({
    // Fetches profile metadata used to gate the rest of the analyzer UI.
    getUser: builder.query({
      query: (username) => `/users/${username}`,
    }),
    // Fetches repository pages; the merge config below turns Load More into one growing cache entry.
    getUserRepos: builder.query({
      query: ({
        username,
        page = 1,
        perPage = 30,
        sort = "updated",
        direction = "desc",
        type = "owner",
      }) => ({
        url: `/repos/${username}/repos`,
        params: {
          page,
          perPage,
          sort,
          direction,
          type,
        },
      }),
      // Page is intentionally excluded so all pages for the same user+sort append into one list.
      serializeQueryArgs: ({ queryArgs }) => `${queryArgs.username}-${queryArgs.sort}`,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }

        currentCache.results = newItems.results;
        currentCache.data.repos.push(...(newItems.data?.repos ?? []));
      },
      // Page changes should still request the next page even though the cache key stays stable.
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
  }),
});

export const { useGetUserQuery, useGetUserReposQuery } = githubApi;
