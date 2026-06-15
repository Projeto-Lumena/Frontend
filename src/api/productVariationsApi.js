import apiClient from './config.js';

const productVariationsApi = {
  async getAll() {
    let page = 1
    let all = []
    let totalPages = 1

    while (page <= totalPages) {
      const res = await apiClient.get(`/produto-variacao/?page=${page}`)

      all = all.concat(res.data.results)
      totalPages = res.data.total_pages
      page++
    }

    return all
  },

  getByProductId(productId) {
    return apiClient.get(`/produto-variacao/?produto=${productId}`);
  },

  create(data) {
    return apiClient.post('/produto-variacao/', data);
  },

  update(id, data) {
    return apiClient.patch(`/produto-variacao/${id}/`, data);
  },

  remove(id) {
    return apiClient.delete(`/produto-variacao/${id}/`);
  }
};

export default productVariationsApi;