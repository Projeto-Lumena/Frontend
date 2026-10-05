import apiClient from './config.js';

const productsApi = {
  async getAll() {
    let page = 1
    let all = []
    let totalPages = 1

    while (page <= totalPages) {
      const res = await apiClient.get(`/produto/?page=${page}`)

      all = all.concat(res.data.results)
      totalPages = res.data.total_pages
      page++
    }

    return all
  },

  getById(id) {
    return apiClient.get(`/produto/${id}/`);
  },

  create(data) {
    return apiClient.post('/produto/', data);
  },

  update(id, data) {
    return apiClient.patch(`/produto/${id}/`, data);
  },

  remove(id) {
    return apiClient.delete(`/produto/${id}/`);
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

export default productsApi;
