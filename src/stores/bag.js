import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const GUEST_BAG_KEY = 'lumena-bag-guest'

function readBag(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeBag(key, bagItems) {
  localStorage.setItem(key, JSON.stringify(bagItems))
}

function mergeItems(baseItems, extraItems) {
  const merged = baseItems.map((item) => ({ ...item }))

  extraItems.forEach((extraItem) => {
    const quantidade = Number(extraItem.quantidade) || 1
    const existing = merged.find((item) => item.id === extraItem.id)

    if (existing) {
      existing.quantidade += quantidade
    } else {
      merged.push({ ...extraItem, quantidade })
    }
  })

  return merged
}

export const useBagStore = defineStore('bag', () => {
  const authStore = useAuthStore()

  const items = ref([])

  function getUserBagKey() {
    return authStore.userEmail ? `lumena-bag-${authStore.userEmail}` : null
  }

  function getBagKey() {
    return getUserBagKey() || GUEST_BAG_KEY
  }

  /**
   * Carrega a sacola do usuário logado. Se ele adicionou itens antes de
   * entrar (sacola de visitante), esses itens são mesclados na sacola dele.
   */
  function loadBag() {
    const userKey = getUserBagKey()

    if (!userKey) {
      items.value = readBag(GUEST_BAG_KEY)
      return
    }

    const guestItems = readBag(GUEST_BAG_KEY)
    const userItems = readBag(userKey)

    if (guestItems.length) {
      items.value = mergeItems(userItems, guestItems)
      writeBag(userKey, items.value)
      localStorage.removeItem(GUEST_BAG_KEY)
      return
    }

    items.value = userItems
  }

  function saveBag() {
    writeBag(getBagKey(), items.value)
  }

  function addToBag(product, quantidade = 1) {
    const quantidadeValida =
      Number(quantidade) > 0 ? Number(quantidade) : 1

    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantidade += quantidadeValida
    } else {
      items.value.push({
        ...product,
        quantidade: quantidadeValida
      })
    }

    saveBag()
  }

  function increaseQuantity(id) {
    const item = items.value.find((item) => item.id === id)

    if (item) {
      item.quantidade++
      saveBag()
    }
  }

  function decreaseQuantity(id) {
    const item = items.value.find((item) => item.id === id)

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
    items.value = items.value.filter((item) => item.id !== id)

    saveBag()
  }

  function clearBag() {
    items.value = []
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
