<script setup>
defineProps({
    product: {
        type: Object,
        default: null
    }
})
</script>

<template>
    <div v-if="!product" class="px-6 mt-6 text-[#2C2828] font-semibold">
        Produto não encontrado.
    </div>

    <div v-else>
        <div class="pt-2 pb-5">
            <h1 class="text-2xl lg:text-4xl text-center text-[#0C2645] font-[Cinzel] border-b-1 pb-3 mb-3">
                Vela Aromática - {{ product.nome }}
            </h1>

            <div class="border-gray-300 border-3 p-1">
                <img v-if="product.imagem?.url" :src="product.imagem.url" :alt="product.nome" class="w-full" />
            </div>
        </div>
    </div>
</template>
