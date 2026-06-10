import { beforeEach, describe, expect, it } from 'vitest';

import { clear, get, set } from '../services/cache.service.js';

beforeEach(() => {
  clear();
});

describe('cache service', () => {
  it('returns null for a missing key', () => {
    expect(get('missing-key')).toBeNull();
  });

  it('returns the same data after setting a key', () => {
    const data = {
      login: 'octocat',
      public_repos: 8,
    };

    set('github:user:octocat', data);

    expect(get('github:user:octocat')).toEqual(data);
  });
});
