import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBagStore = defineStore('bag', () => {
  const items = ref(
    JSON.parse(localStorage.getItem('lumena-bag') || '[]')
  )

  function saveBag() {
    localStorage.setItem('lumena-bag', JSON.stringify(items.value))
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
    const item = items.value.find(item => item.id === id)

    if (item) {
      item.quantidade++
      saveBag()
    }
  }

  function decreaseQuantity(id) {
    const item = items.value.find(item => item.id === id)

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
    items.value = items.value.filter(item => item.id !== id)
    saveBag()
  }

  const subtotal = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  })

  const descontos = computed(() => 0)

  const total = computed(() => {
    return subtotal.value - descontos.value
  })

  const totalItems = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.quantidade,
      0
    )
  })

  return {
    items,
    subtotal,
    descontos,
    total,
    totalItems,
    addToBag,
    increaseQuantity,
    decreaseQuantity,
    removeFromBag
  }
})