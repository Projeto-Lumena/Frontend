import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import authApi from '../api/authApi';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token'));
  const refreshToken = ref(localStorage.getItem('refresh_token'));
  const userEmail = ref(localStorage.getItem('user_email'))

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(email, password) {
    const { data } = await authApi.login(email, password);

    accessToken.value = data.access;
    refreshToken.value = data.refresh;
    userEmail.value = email;

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_email', email);
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
    userEmail.value = null

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
  }

  async function updateProfile(id, data) {
    const response = await authApi.updateProfile(id, data);
    return response.data;
  }

  return {
    accessToken,
    refreshToken,
    userEmail,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };
});