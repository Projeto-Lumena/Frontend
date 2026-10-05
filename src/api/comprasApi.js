import apiClient from './config.js';

const comprasApi = {
  async getAll() {
    let page = 1
    let all = []
    let totalPages = 1

    while (page <= totalPages) {
      const res = await apiClient.get(`/compra/?page=${page}`)

      all = all.concat(res.data.results)
      totalPages = res.data.total_pages
      page++
    }

    return all
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
