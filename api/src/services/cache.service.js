const cache = new Map();
const DEFAULT_TTL = 60 * 1000;

const isExpired = (item) => Date.now() > item.expiresAt;

export const get = (key) => {
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  if (isExpired(item)) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const set = (key, data, ttl = DEFAULT_TTL) => {
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
