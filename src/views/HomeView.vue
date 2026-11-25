<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBannerStore } from '@/stores/useBannerStore'

import Banner from '@/components/BannerComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'
import InstallButton from '@/components/InstallButton.vue'
import HomeLoginMessage from '@/components/home/HomeLoginMessage.vue'
import HomeProducts from '@/components/home/HomeProducts.vue'

import { useHomeProducts } from '@/composables/useHomeProducts'

const route = useRoute()
const router = useRouter()

const store = useBannerStore()
const storeProducts = useProductsStore()

const showLoginMessage = ref(false)

const {
  productsFiltradas,
  aplicarFiltros,
  limparFiltros
} = useHomeProducts(storeProducts)

onMounted(() => {
  if (route.query.login === 'success') {
    showLoginMessage.value = true

    setTimeout(() => {
      showLoginMessage.value = false
    }, 4000)

    router.replace({
      path: route.path,
      query: {}
    })
  }

  storeProducts.fetchProducts()
})
</script>

<template>
  <Banner :imagens="store.getBanners('home')" />

  <HomeLoginMessage :show="showLoginMessage" />

  <FilterComponent @aplicar="aplicarFiltros" @limpar="limparFiltros" />

  <HomeProducts :products="productsFiltradas" :loading="storeProducts.loading" :error="storeProducts.error" />

  <InstallButton />
</template>
