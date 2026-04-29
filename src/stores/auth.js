import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const DEFAULT_JOIN_DATE = '2026-04-28';

function createToken(email) {
  return btoa(`${email}-${Date.now()}`);
}

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage('kts-auth-user', null);
  const token = useLocalStorage('kts-auth-token', null);

  const isAuthenticated = computed(() => Boolean(token.value && user.value));

  function login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const nextUser = {
      email,
      displayName: email.split('@')[0],
      joinDate: user.value?.joinDate ?? DEFAULT_JOIN_DATE,
    };

    user.value = nextUser;
    token.value = createToken(email);

    return nextUser;
  }

  function logout() {
    user.value = null;
    token.value = null;
    sessionStorage.removeItem('kts-can-view-order-success');
  }

  function register(data) {
    const nextUser = {
      email: data.email,
      displayName: data.name || data.email.split('@')[0],
      joinDate: DEFAULT_JOIN_DATE,
    };

    user.value = nextUser;
    token.value = createToken(data.email);

    return nextUser;
  }

  function updateDisplayName(displayName) {
    if (!user.value) {
      return;
    }

    user.value = {
      ...user.value,
      displayName,
    };
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    register,
    updateDisplayName,
  };
});
