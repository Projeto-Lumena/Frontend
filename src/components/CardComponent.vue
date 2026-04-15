<script setup>
defineProps({
  candle: Object
})
</script>

<template>
  <div class="m-2 border text-center border-[#E7EAE9] p-1 justify-around">
    <img 
      :src="candle.imagem" 
      :alt="candle.nome" 
      class="w-full object-cover mb-2"
    />

    <h2 class="mb-4">
      Vela Aromática {{ candle.nome }}
    </h2>

    <p class="text-[#2C2828] text-sm font-semibold">
      R$ {{ candle.preco.toFixed(2).replace('.', ',') }}
    </p>
  </div>
</template>