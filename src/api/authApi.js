import apiClient from './config';

export default {
  login(email, password) {
    return apiClient.post('/token/', { email, password });
  },

  getMe() {
    return apiClient.get('/usuarios/me/');
  },
  uploadImage(file, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    return apiClient.post('/uploads/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};