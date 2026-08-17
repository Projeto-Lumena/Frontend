import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import authApi from '../api/authApi';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token'));
  const refreshToken = ref(localStorage.getItem('refresh_token'));

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(email, password) {
    const { data } = await authApi.login(email, password);

    accessToken.value = data.access;
    refreshToken.value = data.refresh;

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }

  async function register(userData) {
    await authApi.register(userData);

    await login(
      userData.email,
      userData.password
    );
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async function updateProfile(id, data) {
    const response = await authApi.updateProfile(id, data);
    return response.data;
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };
});