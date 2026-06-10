const cache = new Map();
const DEFAULT_TTL = 60 * 1000;

// Store absolute expiry timestamps so reads can evict stale values without a background worker.
const isExpired = (item) => Date.now() > item.expiresAt;

export const get = (key) => {
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  if (isExpired(item)) {
    // Lazy deletion keeps the in-memory cache tiny without running scheduled cleanup.
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const set = (key, data, ttl = DEFAULT_TTL) => {
  // TTL is per-write so GitHub services can tune freshness without changing cache internals.
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
};

export const remove = (key) => {
  cache.delete(key);
};

export const clear = () => {
  cache.clear();
};
