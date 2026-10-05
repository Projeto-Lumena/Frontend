import apiClient from './config.js';

const comprasApi = {
  getAll() {
    return apiClient.get('/compra/');
  },

  getById(id) {
    return apiClient.get(`/compra/${id}/`);
  },

  create(data) {
    return apiClient.post('/compra/', data);
  },

  update(id, data) {
    return apiClient.patch(`/compra/${id}/`, data);
  },

  remove(id) {
    return apiClient.delete(`/compra/${id}/`);
  },
};

export default comprasApi;