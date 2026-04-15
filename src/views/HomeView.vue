<script setup>
import { ref, computed } from 'vue'
import { useCandles } from '@/composables/useCandles'
import CardComponent from '@/components/CardComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'

const { candles, loading, error } = useCandles()

const candlesAgrupadas = computed(() => {
  const mapa = {}

  candles.value.forEach(candle => {
    if (!mapa[candle.nome]) {
      mapa[candle.nome] = {
        nome: candle.nome,
        imagem: candle.imagem,
        categoria: candle.categoria,
        precos: []
      }
    }

    mapa[candle.nome].precos.push(candle.preco)
  })

  return Object.values(mapa).map(item => {
    const menor = Math.min(...item.precos)
    const maior = Math.max(...item.precos)

    return {
      ...item,
      precoMin: menor,
      precoMax: maior
    }
  })
})

const filtros = ref({
  ordenacao: '',
  colecoes: []
})

const aplicarFiltros = (dados) => {
  filtros.value = dados
}

const limparFiltros = () => {
  filtros.value = {
    ordenacao: '',
    colecoes: []
  }
}

const candlesFiltradas = computed(() => {
  let lista = [...candlesAgrupadas.value]

  if (filtros.value.colecoes.length > 0) {
    lista = lista.filter(candle =>
      candle.categoria.some(cat =>
        filtros.value.colecoes.includes(cat)
      )
    )
  }

  if (filtros.value.ordenacao === 'maior') {
    lista.sort((a, b) => b.preco - a.preco)
  }

  if (filtros.value.ordenacao === 'menor') {
    lista.sort((a, b) => a.preco - b.preco)
  }

  if (filtros.value.ordenacao === 'alfabetica') {
    lista.sort((a, b) => a.nome.localeCompare(b.nome))
  }

  if (filtros.value.ordenacao === 'decrescente') {
    lista.sort((a, b) => b.nome.localeCompare(a.nome))
  }

  return lista
})
</script>

<template>
  <h1>Home</h1>

  <FilterComponent @aplicar="aplicarFiltros" @limpar="limparFiltros" />

  <p v-if="loading">Carregando...</p>
  <p v-else-if="error">{{ error }}</p>

  <div v-else-if="candlesFiltradas.length > 0" class="grid grid-cols-2 m-4">
    <CardComponent v-for="candle in candlesFiltradas" :key="candle.id" :candle="candle" />
  </div>
</template>