import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export const useBagStore = defineStore('bag', () => {
  const authStore = useAuthStore()

  const items = ref([])

  function getBagKey() {
    if (!authStore.userEmail) {
      return null
    }

    return `lumena-bag-${authStore.userEmail}`
  }

  function loadBag() {
    const key = getBagKey()

    if (!key) {
      items.value = []
      return
    }

    try {
      items.value = JSON.parse(
        localStorage.getItem(key) || '[]'
      )
    } catch {
      items.value = []
    }
  }

  function saveBag() {
    const key = getBagKey()

    if (!key) return

    localStorage.setItem(
      key,
      JSON.stringify(items.value)
    )
  }

  function addToBag(product) {
    const existingItem = items.value.find(
      item => item.id === product.id
    )

    if (existingItem) {
      existingItem.quantidade++
    } else {
      items.value.push({
        ...product,
        quantidade: 1
      })
    }

    saveBag()
  }

  function increaseQuantity(id) {
    const item = items.value.find(
      item => item.id === id
    )

    if (item) {
      item.quantidade++
      saveBag()
    }
  }

  function decreaseQuantity(id) {
    const item = items.value.find(
      item => item.id === id
    )

    if (!item) return

    if (item.quantidade > 1) {
      item.quantidade--
    } else {
      removeFromBag(id)
      return
    }

    saveBag()
  }

  function removeFromBag(id) {
    items.value = items.value.filter(
      item => item.id !== id
    )

    saveBag()
  }

  const subtotal = computed(() => {
    return items.value.reduce(
      (total, item) =>
        total + item.preco * item.quantidade,
      0
    )
  })

  const descontos = computed(() => 0)

  const total = computed(() => {
    return subtotal.value - descontos.value
  })

  const totalItems = computed(() => {
    return items.value.reduce(
      (total, item) =>
        total + item.quantidade,
      0
    )
  })
  
  function clearBag() {
    items.value = []
    saveBag()
  }
  
  watch(
    () => authStore.userEmail,
    () => {
      loadBag()
    },
    { immediate: true }
  )

  return {
    items,
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