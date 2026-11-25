<script setup>
defineProps({
    items: {
        type: Array,
        required: true
    },
    formatPrice: {
        type: Function,
        required: true
    }
})
</script>

<template>
    <div class="mb-10">
        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
            PRODUTOS
        </h2>

        <div v-for="item in items" :key="item.id" class="mb-3 flex min-h-[150px] border border-[#BFC0C0] p-3">
            <div class="h-[125px] w-[125px] shrink-0 overflow-hidden border border-[#E1E1E1]">
                <img :src="item.imagem" :alt="item.nome" class="h-full w-full object-cover">
            </div>

            <div class="ml-5 flex flex-1 flex-col justify-between py-1">
                <div>
                    <p class="text-base text-[#2C2828]">Vela Aromática -</p>
                    <p class="text-base text-[#2C2828]">{{ item.nome }}</p>
                    <p class="mt-2 text-sm text-[#2C2828]">
                        Tamanho: {{ item.tamanho }}
                    </p>
                    <p class="text-sm text-[#2C2828]">
                        Quantidade: {{ item.quantidade }}
                    </p>
                </div>

                <p class="text-lg text-[#2C2828]">
                    R${{ formatPrice(item.preco * item.quantidade) }}
                </p>
            </div>
        </div>
    </div>
</template>
