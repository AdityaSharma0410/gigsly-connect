import type { ApiUser } from '@/types/api';

const TOKEN_KEY = 'gigsly_token';
const USER_KEY = 'gigsly_user';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string | null) => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  },
  getUser: (): ApiUser | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as ApiUser) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: ApiUser | null) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore
    }
  },
  clear: () => {
    authStorage.setToken(null);
    authStorage.setUser(null);
  },
};

