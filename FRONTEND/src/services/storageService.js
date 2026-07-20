/**
 * storageService.js
 * Rôle : Gère le stockage persistant dans le navigateur (ex: localStorage).
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'payedu_auth_token',
};

export const storageService = {
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  clearAll: () => {
    localStorage.clear();
  }
};
