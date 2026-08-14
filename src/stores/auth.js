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
  // Cria o usuário
  await authApi.register(userData);

  // Faz login automaticamente
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

  async function updateProfile(id, { title, imgAttachmentKey } = {}) {
    if (title !== undefined && !title.trim()) return;
    error.value = null;
    const payload = {};
    if (title !== undefined) payload.title = title.trim();
    if (imgAttachmentKey != null) payload.img_attachment_key = imgAttachmentKey;
    try {
      const response = await authApi.updateProfile(id, payload);
      const index = profiles.value.findIndex((t) => t.id === id);
      if (index !== -1) profiles.value[index] = response.data;
    } catch (err) {
      error.value = 'Erro ao editar perfil.';
      console.error(err);
    }
  }

  return { accessToken, refreshToken, isAuthenticated, login, register, logout, updateProfile };
});