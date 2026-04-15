<script setup>
import Banner from '@/components/BannerComponent.vue'
import { useBannerStore } from '@/stores/useBannerStore'

const store = useBannerStore()
</script>

<template>
  <Banner :imagens="store.getBanners('home')" />
</template>