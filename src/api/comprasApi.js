
import apiClient from './config.js'

const comprasApi = {
  async getAll() {
    let page = 1
    let all = []
    let totalPages = 1

    while (page <= totalPages) {
      const { data } = await apiClient.get(`/compra/?page=${page}`)

      all = all.concat(data.results)
      totalPages = data.total_pages
      page++
    }

    return all
  },

  async getBag() {
    const compras = await this.getAll()

    return compras.find(compra => compra.status === 'Carrinho') || null
  },

  async getById(id) {
    const { data } = await apiClient.get(`/compra/${id}/`)
    return data
  },

  async create(data) {
    const { data: compra } = await apiClient.post('/compra/', data)
    return compra
  },

  async update(id, data) {
    const { data: compra } = await apiClient.patch(`/compra/${id}/`, data)
    return compra
  },
  async finalizar(id) {
    const { data } = await apiClient.post(`/compra/${id}/finalizar/`)
    return data
  }
}

export default comprasApi
