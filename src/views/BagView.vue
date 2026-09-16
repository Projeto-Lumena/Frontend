<script setup>
import { computed } from 'vue'
import { useBagStore } from '@/stores/bag.js'

const bagStore = useBagStore()

const items = computed(() => bagStore.items)

function formatPrice(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>
<template>
    <h1 class="text-4xl text-center text-[#0C2645] font-[Cinzel] md:text-4xl lg:text-5xl mt-10 mb-10"> Sacola </h1>
    <section class="mx-auto w-[calc(100%-54px)] max-w-[900px] mb-20">
        <div v-for="item in items" :key="item.id" class="flex border border-[#BFC0C0] mb-3 p-2 h-[140px] items-center">
            <RouterLink :to="{
                name: 'produto',
                params: { id: item.produtoId || item.id }
            }" class="w-[118px] h-[120px] shrink-0">
                <img :src="item.imagem" :alt="`Vela Aromática - ${item.nome}`" class="w-full h-full object-cover" />
            </RouterLink>
            <div class="flex flex-col justify-between h-full ml-3 flex-1 py-1">
                <RouterLink :to="{
                    name: 'produto',
                    params: { id: item.produtoId || item.id }
                }">
                    <p class="text-[14px] leading-[17px] text-[#2C2828]"> Vela Aromática -</p>
                    <p class="text-[14px] leading-[17px] text-[#2C2828]">{{ item.nome }}</p>
                    <p class="text-[13px] text-[#2C2828]"> Tamanho: {{ item.tamanho }}</p>
                </RouterLink>
                <p class="text-[21px] text-[#2C2828]"> R${{ formatPrice(item.preco) }} </p>
            </div>
            <div class="flex items-center justify-between border border-[#BFC0C0] w-[81px] h-[38px] mt-20 px-2">
                <button type="button" class="text-xl font-light" @click="bagStore.decreaseQuantity(item.id)"> −
                </button>
                <span class="text-sm">{{ item.quantidade }}</span>
                <button type="button" class="text-xl font-light" @click="bagStore.increaseQuantity(item.id)"> +
                </button>
            </div>
        </div>
        <div v-if="items.length === 0" class="text-center text-[#2C2828] py-10">
            Sua sacola está vazia.
        </div>
        <div class="fixed bottom-20 z-50 bg-[#0C2645] w-full left-0 right-0 ">
            <div class="border-t border-[#BFC0C0] bg-white">
                <div class="flex justify-between px-4 py-2 text-sm">
                    <span>Subtotal</span>
                    <span> R${{ formatPrice(bagStore.subtotal) }}</span>
                </div>
                <div class="flex justify-between border-t border-[#BFC0C0] px-4 py-2 text-sm">
                    <span>Descontos</span>
                    <span> R${{ formatPrice(bagStore.descontos) }}</span>
                </div>
            </div>
            <button type="button"
                class="w-full h-15 bg-[#0C2645] text-white text-lg flex items-center justify-between px-4 hover:bg-[#163657] transition">
                <span>Fazer Pedido</span>
                <span> R${{ formatPrice(bagStore.total) }}</span>
            </button>
        </div>
    </section>
</template>