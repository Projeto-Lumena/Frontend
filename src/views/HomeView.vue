<script setup>
import Banner from '@/components/BannerComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
import { useBannerStore } from '@/stores/useBannerStore'
import { useCandles } from '@/composables/useCandles'

const { candles, loading, error } = useCandles()
const store = useBannerStore()
</script>

<template>
  <Banner :imagens="store.getBanners('home')" />
  <h1>Home</h1>

  <p v-if="loading">Carregando...</p>
  <p v-if="error">{{ error }}</p>

  <div class="grid grid-cols-2 m-4">
    <CardComponent 
      v-for="candle in candles" 
      :key="candle.id"
      :candle="candle"
    />
  </div>
</template>