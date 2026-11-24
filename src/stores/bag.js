import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import comprasApi from '@/api/comprasApi'

export const useBagStore = defineStore('bag', () => {
  const authStore = useAuthStore()
  const productsStore = useProductsStore()

  const items = ref([])
  const compraId = ref(null)
  const loading = ref(false)

  function normalizeItem(item) {
    const produto = productsStore.products.find(
      p => String(p.id) === String(item.produto.id)
    )

    return {
      id: item.variacao.id,
      produtoId: item.produto.id,
      nome: item.produto.nome,
      tamanho: item.variacao.tamanho,
      preco: Number(item.variacao.preco),
      imagem: produto?.imagem?.url ?? null,
      quantidade: item.quantidade
    }
  }

  async function ensureProductsLoaded() {
    if (!productsStore.products.length) {
      await productsStore.fetchProducts()
    }
  }

  async function normalizeCompra(compra) {
    await ensureProductsLoaded()

    compraId.value = compra?.id ?? null
    items.value = compra?.itens?.map(normalizeItem) ?? []
  }

  function getPayload(lista = items.value) {
    return {
      itens: lista.map(item => ({
        produto: Number(item.produtoId),
        variacao: Number(item.id),
        quantidade: Number(item.quantidade)
      }))
    }
  }

  async function loadBag() {
    if (!authStore.isAuthenticated) {
      items.value = []
      compraId.value = null
      return
    }

    loading.value = true

    try {
      const compra = await comprasApi.getBag()
      await normalizeCompra(compra)
    } catch (error) {
      console.error('Erro ao carregar a sacola:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function saveBag() {
    if (!authStore.isAuthenticated) {
      throw new Error('É necessário entrar na conta para utilizar a sacola.')
    }

    const payload = getPayload()

    if (compraId.value) {
      await comprasApi.update(compraId.value, payload)
    } else {
      await comprasApi.create(payload)

      const compra = await comprasApi.getBag()
      normalizeCompra(compra)
      return
    }

    const compra = await comprasApi.getById(compraId.value)
    normalizeCompra(compra)
  }

  async function addToBag(product, quantidade = 1) {
    if (!authStore.isAuthenticated) {
      throw new Error('Faça login para adicionar produtos à sacola.')
    }

    const quantidadeValida =
      Number(quantidade) > 0 ? Number(quantidade) : 1

    const existingItem = items.value.find(
      item => item.id === product.id
    )

    if (existingItem) {
      existingItem.quantidade += quantidadeValida
    } else {
      items.value.push({
        ...product,
        quantidade: quantidadeValida
      })
    }

    await saveBag()
  }

  async function increaseQuantity(id) {
    const item = items.value.find(item => item.id === id)
    if (!item) return

    item.quantidade++
    await saveBag()
  }

  async function decreaseQuantity(id) {
    const item = items.value.find(item => item.id === id)
    if (!item) return

    if (item.quantidade > 1) {
      item.quantidade--
    } else {
      items.value = items.value.filter(item => item.id !== id)
    }

    await saveBag()
  }

  async function removeFromBag(id) {
    items.value = items.value.filter(item => item.id !== id)
    await saveBag()
  }

  async function clearBag() {
    items.value = []
    await saveBag()
  }

  const subtotal = computed(() =>
    items.value.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  )

  const descontos = computed(() => 0)

  const total = computed(() => subtotal.value - descontos.value)

  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantidade, 0)
  )

  watch(
    () => authStore.userEmail,
    () => {
      loadBag().catch(error => {
        console.error(error)
      })
    },
    { immediate: true }
  )

  return {
    items,
    compraId,
    loading,
    subtotal,
    descontos,
    total,
    totalItems,
    loadBag,
    addToBag,
    increaseQuantity,
    decreaseQuantity,
    removeFromBag,
    clearBag
  }
})
