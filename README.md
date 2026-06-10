# Repolyzer

Repolyzer is a GitHub profile and repository analyzer. It lets a user search a GitHub username, view profile details, inspect public repositories, sort and paginate repositories, open repository analyzer modals, and view a language breakdown based on the currently loaded repositories.

The project is split into two separate apps:

- `api`: Express backend that proxies GitHub API requests, normalizes responses/errors, applies rate limiting, and caches GitHub responses in memory.
- `web`: React frontend built with Vite, Tailwind CSS, Redux Toolkit, and RTK Query.

The root `package.json` only exists to run both apps from the project root. The API and web apps keep their own `package.json`, lockfile, dependencies, and environment files.

## Features

- Search GitHub users by username.
- Debounced search input to avoid firing requests on every keystroke.
- Recent search dropdown stored in `localStorage`.
- Profile card with avatar, bio, stats, and contribution heatmap image.
- Repository grid with sorting and load-more pagination.
- Repository detail modal with analyzer-style stats, health signals, metadata, timeline, topics, and GitHub links.
- Language analyzer modal based on currently loaded repositories.
- Skeleton loading states that avoid showing stale user/repo data.
- In-memory backend cache for GitHub responses.
- Frontend RTK Query cache with append-on-load-more behavior.
- Centralized backend error handling and rate limiting.

## Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS 4
- Redux Toolkit
- RTK Query
- React Redux
- Recharts
- Lucide React icons

### Backend

- Node.js
- Express 5
- Axios
- dotenv
- cors
- express-rate-limit
- Vitest
- Supertest

## Getting Started

### Prerequisites

- Node.js 20 or newer is recommended.
- npm
- A GitHub token is recommended for higher GitHub API rate limits.

### Install Dependencies

Run these from the project root:

```bash
npm --prefix api install
npm --prefix web install
```

### Configure Environment

Create `api/.env`:

```bash
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:5173
GITHUB_TOKEN=your_github_token_here
```

Create `web/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

You can use the existing examples:

- `api/.env.example`
- `web/.env.example`

### Run The Project

Start the API:

```bash
npm run dev:api
```

Start the frontend:

```bash
npm run dev:web
```

Default local URLs:

- Frontend: `http://localhost:5173`
- API root: `http://localhost:8080`
- API base: `http://localhost:8080/api`

## Root Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev:api` | Starts the Express API with Node watch mode. |
| `npm run dev:web` | Starts the Vite frontend dev server. |
| `npm run build:web` | Builds the frontend for production. |
| `npm run preview:web` | Serves the built frontend with Vite preview. |
| `npm run start:api` | Starts the API without watch mode. |
| `npm run test:api` | Runs backend route/controller and cache tests. |

## App Flow

1. The user types a GitHub username in the search bar.
2. `useDebounce` waits for typing to pause before committing the search.
3. `App.jsx` stores the committed username, resets repo pagination, and saves the username in recent searches.
4. RTK Query calls the backend profile endpoint.
5. The backend calls GitHub through the configured Axios client.
6. The backend caches successful GitHub responses for 60 seconds.
7. The frontend renders the profile section once fresh data matches the searched username.
8. Repository data is fetched through RTK Query with sort and page params.
9. Load More updates the page state; RTK Query merges the next page into the same repo cache entry.
10. The language analyzer modal reads the currently loaded repo cache. It does not make a separate API request.
11. Repository cards open a modal that derives analyzer metrics from the repo object already loaded in the list.

## Project Structure

```text
repolyzer/
  package.json
  README.md
  api/
    package.json
    .env.example
    src/
      app.js
      server.js
      config/
        env.js
        github.js
      controllers/
        repos.controller.js
        users.controller.js
      __tests__/
        cache.test.js
        repos.test.js
        users.test.js
      middleware/
        globalErrorHandler.js
        rateLimiter.js
      routes/
        health.routes.js
        index.js
        repos.js
        users.js
      services/
        cache.service.js
        github.service.js
      utils/
        appError.js
        catchAsync.js
  web/
    package.json
    .env.example
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      app/
        store.js
      features/
        github/
          githubApi.js
          githubSlice.js
          components/
            LanguageChart.jsx
            RepoCard/
              index.js
              RepoCard.jsx
              useRepoCard.jsx
            RepoList/
              index.js
              RepoList.jsx
              useRepoList.jsx
            UserProfile/
              index.js
              UserProfile.jsx
              useUserProfile.jsx
      shared/
        components/
          AppHeader.jsx
          ErrorMessage.jsx
          SearchBar.jsx
          SkeletonCard.jsx
          SkeletonProfile.jsx
          SortDropdown.jsx
        hooks/
          useDebounce.jsx
      styles/
        index.css
```

## File Responsibilities

### Root

| File | Why it exists |
| --- | --- |
| `package.json` | Provides root-level commands to run API and web without mixing their dependencies. |
| `.gitignore` | Keeps one shared ignore list for the whole workspace. |
| `README.md` | Documents setup, architecture, API usage, and future plans. |

### Backend

| File | Why it exists |
| --- | --- |
| `api/package.json` | Defines API-only scripts and backend dependencies. |
| `api/package-lock.json` | Locks backend dependency versions for repeatable installs. |
| `api/.env.example` | Documents the environment variables the API expects. |
| `api/src/server.js` | Creates the Express app and starts listening on `env.PORT`. |
| `api/src/app.js` | Builds the Express app, applies CORS, body parsers, routes, rate limiter, 404 handling, and global error handling. |
| `api/src/config/env.js` | Loads environment variables and converts `PORT` into a number before use. |
| `api/src/config/github.js` | Creates a shared Axios GitHub client with base URL, Accept header, and optional auth token. |
| `api/src/routes/index.js` | Combines resource routers under `/api`. |
| `api/src/routes/users.js` | Defines the user profile endpoint. |
| `api/src/routes/repos.js` | Defines the user repository collection endpoint. |
| `api/src/routes/health.routes.js` | Provides health responses for uptime checks. |
| `api/src/controllers/users.controller.js` | Handles HTTP request/response shape for user profile fetches. |
| `api/src/controllers/repos.controller.js` | Handles query params and response shape for repository list fetches. |
| `api/src/__tests__/users.test.js` | Verifies user route/controller behavior with the GitHub service mocked. |
| `api/src/__tests__/repos.test.js` | Verifies repo route/controller behavior, including query params passed to the service. |
| `api/src/__tests__/cache.test.js` | Unit-tests the in-memory cache service without mocks. |
| `api/src/services/github.service.js` | Owns GitHub API calls, path validation, params cleanup, GitHub error mapping, and cache usage. |
| `api/src/services/cache.service.js` | Provides the in-memory TTL cache used by GitHub services. |
| `api/src/middleware/rateLimiter.js` | Limits `/api` request bursts to protect the proxy and GitHub quota. |
| `api/src/middleware/globalErrorHandler.js` | Sends detailed errors in development and safe errors in production. |
| `api/src/utils/appError.js` | Standardizes operational errors with status code and status text. |
| `api/src/utils/catchAsync.js` | Forwards async controller rejections to Express error middleware. |

### Frontend

| File | Why it exists |
| --- | --- |
| `web/package.json` | Defines web-only scripts and frontend dependencies. |
| `web/package-lock.json` | Locks frontend dependency versions for repeatable installs. |
| `web/.env.example` | Documents the frontend API base URL variable. |
| `web/index.html` | Provides the Vite HTML entry and root DOM node. |
| `web/vite.config.js` | Configures Vite, React, and Tailwind integration. |
| `web/src/main.jsx` | Mounts React and provides the Redux store. |
| `web/src/App.jsx` | Coordinates search state, profile gating, repo sort/page state, stale-data loading guards, and layout. |
| `web/src/app/store.js` | Registers the GitHub RTK Query API slice and local GitHub reducer. |
| `web/src/features/github/githubApi.js` | Defines RTK Query endpoints for profile and repo data, including repo page merge behavior. |
| `web/src/features/github/githubSlice.js` | Stores recent searches and syncs them with `localStorage`. |
| `web/src/features/github/components/UserProfile/UserProfile.jsx` | Renders profile details, contribution chart, and language analyzer modal. |
| `web/src/features/github/components/UserProfile/useUserProfile.jsx` | Owns profile query state, stale-profile detection, modal state, scroll lock, and language aggregation. |
| `web/src/features/github/components/RepoList/RepoList.jsx` | Renders repository grid, empty state, skeletons, and Load More button. |
| `web/src/features/github/components/RepoList/useRepoList.jsx` | Owns repo query state, stale-repo detection, and pagination availability. |
| `web/src/features/github/components/RepoCard/RepoCard.jsx` | Renders compact repo card and repository detail modal. |
| `web/src/features/github/components/RepoCard/useRepoCard.jsx` | Derives repo analyzer metrics, timeline data, modal state, keyboard behavior, and scroll lock. |
| `web/src/features/github/components/LanguageChart.jsx` | Builds a pie chart from the primary language of currently loaded repositories. |
| `web/src/shared/components/AppHeader.jsx` | Provides the shared application header. |
| `web/src/shared/components/ErrorMessage.jsx` | Converts RTK/backend errors into user-facing messages. |
| `web/src/shared/components/SearchBar.jsx` | Provides controlled search input while preventing form reloads. |
| `web/src/shared/components/SkeletonCard.jsx` | Loading placeholder for repository cards. |
| `web/src/shared/components/SkeletonProfile.jsx` | Loading placeholder for profile fetches. |
| `web/src/shared/components/SortDropdown.jsx` | Lets users change GitHub repo sort params. |
| `web/src/shared/hooks/useDebounce.jsx` | Delays search commits until typing pauses. |
| `web/src/styles/index.css` | Tailwind import, GitHub dark theme variables, global button cursor behavior, and modal animations. |

## Testing

Run backend tests from the project root:

```bash
npm run test:api
```

The backend test suite uses Vitest and Supertest.

- User and repo route tests mock `github.service.js`, so tests do not hit the real GitHub API.
- Cache tests call `cache.service.js` directly because the cache is local application logic.
- Repo tests verify that pagination and sort query params are passed into the service layer correctly.

## API Documentation

Base URL in development:

```text
http://localhost:8080
```

Frontend API base:

```text
http://localhost:8080/api
```

### GET `/`

Basic API root check.

Request:

```http
GET /
```

Response:

```json
{
  "name": "repolyzer-api",
  "status": "running"
}
```

### GET `/health`

Root-level health check for infrastructure or manual checks.

Request:

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "repolyzer-api",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### GET `/api/health`

API-scoped health check. Same response shape as `/health`.

Request:

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "service": "repolyzer-api",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### GET `/api/users/:username`

Fetches a GitHub user profile.

Request params:

| Param | Required | Description |
| --- | --- | --- |
| `username` | Yes | GitHub username. |

Example:

```http
GET /api/users/octocat
```

Success response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "login": "octocat",
      "name": "The Octocat",
      "avatar_url": "https://avatars.githubusercontent.com/u/...",
      "bio": "...",
      "followers": 100,
      "following": 10,
      "public_repos": 8
    }
  }
}
```

What it does:

- Validates and encodes `username`.
- Checks the in-memory cache using a normalized user cache key.
- Calls GitHub `GET /users/:username` on cache miss.
- Caches successful GitHub response for 60 seconds.
- Returns GitHub profile data inside `data.user`.

Common errors:

| Status | Meaning |
| --- | --- |
| `400` | Username is missing or empty. |
| `404` | GitHub user was not found. |
| `500` | GitHub or server failure. |

### GET `/api/repos/:username/repos`

Fetches a paginated list of public repositories for a GitHub user.

Request params:

| Param | Required | Description |
| --- | --- | --- |
| `username` | Yes | GitHub username. |

Query params:

| Query | Default | Description |
| --- | --- | --- |
| `page` | `1` | GitHub repo page number. |
| `perPage` | `30` | Frontend-friendly page size alias. |
| `per_page` | `30` | GitHub-style page size alias. Used if `perPage` is not passed. |
| `sort` | `updated` | GitHub sort value. Current UI uses `stars`, `full_name`, and `updated`. |
| `direction` | `desc` | Sort direction sent to GitHub. |
| `type` | `owner` | Repo type sent to GitHub. |

Example:

```http
GET /api/repos/octocat/repos?page=1&perPage=30&sort=stars&type=owner
```

Success response:

```json
{
  "status": "success",
  "results": 30,
  "data": {
    "repos": [
      {
        "id": 123,
        "name": "hello-world",
        "full_name": "octocat/hello-world",
        "description": "My first repository",
        "html_url": "https://github.com/octocat/hello-world",
        "language": "JavaScript",
        "stargazers_count": 42,
        "forks_count": 5,
        "watchers_count": 42,
        "open_issues_count": 1,
        "default_branch": "main",
        "topics": ["demo"],
        "license": {
          "name": "MIT License"
        }
      }
    ]
  }
}
```

What it does:

- Validates and encodes `username`.
- Converts frontend `perPage` into GitHub `per_page`.
- Removes empty query params before calling GitHub.
- Builds a cache key from username and all query params.
- Calls GitHub `GET /users/:username/repos` on cache miss.
- Caches successful GitHub response for 60 seconds.
- Returns `results` as the number of repos in the current page.

Common errors:

| Status | Meaning |
| --- | --- |
| `400` | Username is missing or empty. |
| `404` | GitHub user or resource was not found. |
| `429` | API rate limit middleware blocked the request. |
| `500` | GitHub or server failure. |

## Caching Strategy

### Backend Cache

The backend uses `api/src/services/cache.service.js`, a simple in-memory `Map`.

- Default TTL is 60 seconds.
- Cache entries store `expiresAt`.
- Expired entries are removed lazily when read.
- Failed GitHub requests are not cached.
- User profile cache key format:

```text
github:user:<username>
```

- User repo cache key format:

```text
github:user-repos:<username>:<serialized query params>
```

Why this exists:

- Reduces repeated GitHub API calls.
- Makes repeated searches feel fast.
- Helps avoid GitHub rate limits during development.

Limitations:

- Cache is per Node process.
- Cache is cleared when the API restarts.
- It is not shared between deployments or servers.

### Frontend RTK Query Cache

`web/src/features/github/githubApi.js` uses RTK Query.

For repository pages:

- `serializeQueryArgs` uses `username-sort` as the cache key.
- Page is intentionally excluded from the cache key.
- `merge` appends new page data into `currentCache.data.repos`.
- Page 1 resets the cache for new searches or sort changes.
- `forceRefetch` makes page changes fetch the next page even though the cache key is stable.

Why this exists:

- Load More feels like one growing list.
- The language modal can read currently loaded repos without making a separate request.
- Sorting starts a new repo cache because the result order changes.

### Local Storage

`githubSlice.js` stores recent searches in `localStorage`.

- It keeps the latest 5 searches.
- Re-selecting an existing username moves it to the top.
- Recent searches survive browser refreshes.

## Frontend State Flow

Important states in `App.jsx`:

| State | Purpose |
| --- | --- |
| `searchValue` | Raw input value while the user types. |
| `username` | Debounced committed username that drives API calls. |
| `sort` | Current repo sort field. Also part of the RTK Query repo cache key. |
| `page` | Current repo page for Load More. |
| `isSearchActive` | Controls recent-search dropdown visibility. |

Important stale-data guards:

- Profile UI only renders when returned `user.login` matches the current `username`.
- Repo list only renders when repo owners match the current `username`.
- Skeletons show while a new username is replacing cached data.

## Repository Analyzer Logic

Repository modals do not call a new endpoint. They analyze the repo object already loaded in the list.

Derived signals include:

- Activity score from `pushed_at`.
- Popularity score from stars, forks, and watchers.
- Completeness score from metadata such as description, language, license, homepage, topics, issues, and pull requests.
- Maintenance score from repo status and collaboration settings.
- Timeline from `created_at`, `pushed_at`, and `updated_at`.
- Feature switches from GitHub flags like issues, pull requests, wiki, pages, discussions, and forking.

## Language Analyzer Logic

The language analyzer modal uses currently loaded repositories only.

- It does not call a separate backend endpoint.
- It counts each loaded repo by its `language` field.
- It updates after Load More because RTK Query appends new repos into the loaded cache.
- It is a primary-language breakdown, not a byte-level language breakdown.

For byte-level language stats in the future, the app would need to call GitHub's per-repo `languages_url`.

## Error Handling

Backend:

- `AppError` marks expected operational errors.
- `catchAsync` forwards async controller errors to Express.
- `globalErrorHandler` returns full error details in development.
- In production, operational errors keep their message, while unexpected errors return a generic message.

Frontend:

- `ErrorMessage` maps common backend/RTK statuses to user-friendly copy.
- Profile not found is handled as a dedicated UI state in `App.jsx`.

## Rate Limiting

The API applies `apiRateLimiter` to `/api`.

Current settings:

- Window: 15 minutes
- Limit: 100 requests per IP per window
- Standard rate-limit headers enabled
- Legacy headers disabled

This protects the backend and reduces accidental GitHub API quota bursts.

## Development Notes

- Keep API and web dependencies separate.
- Keep the root `package.json` limited to workspace convenience scripts.
- Do not expose `GITHUB_TOKEN` in the frontend.
- Put API-facing GitHub logic in backend services, not controllers.
- Put complex React component logic in colocated hooks.
- Keep the language modal based on loaded repo cache unless exact per-repo language bytes are added later.

## Future Plans

The plan is to evolve Repolyzer into a reusable GitHub analyzer feature and later integrate it into the `devloopfeed` project.

Possible integration idea:

- Users on DevLoopFeed can connect or display their GitHub profile.
- Their DevLoopFeed profile can show GitHub profile stats, repositories, language breakdown, and repo analyzer insights.
- The current Repolyzer frontend experience can become a profile section or widget inside DevLoopFeed.
- The Express GitHub proxy can be reused or adapted behind DevLoopFeed's backend.

Future feature ideas:

- Byte-level language breakdown using GitHub `languages_url`.
- Repository README preview.
- Contribution and activity insights from GitHub events.
- Star/fork growth tracking.
- Saved favorite profiles.
- Authenticated GitHub connection flow.
- Shareable analyzer pages.
- Better production cache such as Redis.
- Tests for API services, controllers, and key frontend hooks.

## Quick Troubleshooting

### API returns GitHub rate limit errors

Add a valid `GITHUB_TOKEN` in `api/.env`.

### Frontend cannot reach backend

Check `web/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Check `api/.env`:

```bash
FRONTEND_URL=http://localhost:5173
```

### CORS error

Make sure the frontend URL exactly matches `FRONTEND_URL` in `api/.env`.

### Language modal says no language data

Load repositories first, or search a user whose repos have a primary `language` field. The chart uses loaded repo data only.
