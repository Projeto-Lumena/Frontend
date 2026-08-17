<script setup>
defineProps({
  product: Object
})
</script>

<template>
  <div class="m-2 border text-center border-[#E7EAE9] p-1 justify-around">
  <RouterLink :to="{ name: 'produto', params: { id: product.id } }">
    <img
      :src="product.imagem.url"
      :alt="product.nome" 
      class="w-full object-cover mb-2"
    />

    <h2 class="mb-4">
      Vela Aromática {{ product.nome }}
    </h2>

    <p class="text-[#2C2828] text-sm font-semibold">
      R$ {{ product.precoMin.toFixed(2).replace('.', ',') }} - R$ {{ product.precoMax.toFixed(2).replace('.', ',') }}
    </p>
    </RouterLink>
  </div>
</template>