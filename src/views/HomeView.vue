<script setup>
import { useCandles } from '@/composables/useCandles'
import CardComponent from '@/components/CardComponent.vue'

const { candles, loading, error } = useCandles()
</script>

<template>
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