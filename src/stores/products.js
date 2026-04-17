import { ref } from 'vue';
import { defineStore } from 'pinia';
import productsApi from '@/api/productsApi';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchProducts() {

  loading.value = true;
  error.value = null;

  try {
    const response = await productsApi.getAll();

    products.value = response.data?.results || response.data || [];
  } catch (err) {

    error.value = 'Erro ao carregar produtos.';
  } finally {
    loading.value = false;
  }
}

  async function addProduct(data) {
    error.value = null;

    try {
      const response = await productsApi.create(data);

      console.log('RESPOSTA API:', response.data);

      products.value.push(response.data);
    } catch (err) {
      error.value = 'Erro ao adicionar produto.';
      console.error(err);
    }
  }

  async function updateProduct(id, data) {
    error.value = null;

    try {
      const response = await productsApi.update(id, data);
      const index = products.value.findIndex(p => p.id === id);

      if (index !== -1) {
        products.value[index] = response.data;
      }
    } catch (err) {
      error.value = 'Erro ao atualizar produto.';
      console.error(err);
    }
  }

  async function removeProduct(id) {
    error.value = null;

    try {
      await productsApi.remove(id);
      products.value = products.value.filter(p => p.id !== id);
    } catch (err) {
      error.value = 'Erro ao remover produto.';
      console.error(err);
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    removeProduct,
  };
});