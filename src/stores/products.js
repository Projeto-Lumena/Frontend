
import { ref } from 'vue'
import { defineStore } from 'pinia'
import productsApi from '@/api/productsApi'
import productVariationsApi from '@/api/productVariationsApi'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const productVariations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const variationsLoaded = ref(false)

  async function fetchProducts(params = {}) {
    loading.value = true
    error.value = null

    try {
      const prodRes = await productsApi.getAll(params)

      products.value = prodRes

      // Carrega as variações somente na primeira consulta.
      if (!variationsLoaded.value) {
        const varRes = await productVariationsApi.getAll()

        productVariations.value = varRes || []
        variationsLoaded.value = true
      }
    } catch (err) {
      error.value = 'Erro ao carregar dados.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(data) {
    error.value = null

    try {
      const response = await productsApi.create(data)

      console.log('RESPOSTA API:', response.data)

      products.value.push(response.data)
    } catch (err) {
      error.value = 'Erro ao adicionar produto.'
      console.error(err)
    }
  }

  async function updateProduct(id, { title, imgAttachmentKey } = {}) {
    if (title !== undefined && !title.trim()) return

    error.value = null
    const payload = {}

    if (title !== undefined) payload.title = title.trim()
    if (imgAttachmentKey != null) {
      payload.img_attachment_key = imgAttachmentKey
    }

    try {
      const response = await productsApi.update(id, payload)
      const index = products.value.findIndex((p) => p.id === id)

      if (index !== -1) {
        products.value[index] = response.data
      }
    } catch (err) {
      error.value = 'Erro ao editar produto.'
      console.error(err)
    }
  }

  async function removeProduct(id) {
    error.value = null

    try {
      await productsApi.remove(id)

      products.value = products.value.filter((p) => p.id !== id)
    } catch (err) {
      error.value = 'Erro ao remover produto.'
      console.error(err)
    }
  }

  return {
    products,
    productVariations,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    removeProduct,
  }
})
