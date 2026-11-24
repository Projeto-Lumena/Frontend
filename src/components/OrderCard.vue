
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useProductsStore } from '@/stores/products'

const props = defineProps({
    pedido: {
        type: Object,
        required: true
    }
})

const productsStore = useProductsStore()

const indiceAtual = ref(0)
let intervalo = null

const itens = computed(() => props.pedido.itens || [])

const itemAtual = computed(() => {
    return itens.value[indiceAtual.value] || null
})

function proximoProduto() {
    if (itens.value.length > 1) {
        indiceAtual.value = (indiceAtual.value + 1) % itens.value.length
    }
}

function obterImagem(item) {
    return (
        item?.imagem?.url ||
        item?.imagem ||
        item?.produto?.imagem?.url ||
        item?.produto?.imagem ||
        ''
    )
}

function obterNome(item) {
    return item?.produto?.nome || item?.produto || 'Produto'
}

function obterTamanho(item) {
    return item?.variacao?.tamanho || item?.variacao || ''
}

function formatarTotal(valor) {
    return Number(valor || 0).toFixed(2).replace('.', ',')
}

onMounted(() => {
    if (itens.value.length > 1) {
        intervalo = setInterval(proximoProduto, 2000)
    }
})

onUnmounted(() => {
    if (intervalo) {
        clearInterval(intervalo)
    }
})
</script>

<template>
    <RouterLink
        :to="{ name: 'pedido', params: { id: pedido.id } }"
        class="block border border-gray-300 p-3 bg-white transition hover:border-[#0C2645]"
    >
        <div v-if="itemAtual" class="flex gap-3">
            <img
                :src="obterImagem(itemAtual)"
                :alt="obterNome(itemAtual)"
                class="w-[85px] h-[85px] shrink-0 object-cover"
            >

            <div class="min-w-0 flex-1">
                <div class="flex justify-between gap-2">
                    <h3 class="text-[14px] leading-4">
                        {{ obterNome(itemAtual) }}
                    </h3>

                    <span class="text-[10px] text-[#2C2828] whitespace-nowrap">
                        {{ pedido.status }}
                    </span>
                </div>

                <div class="text-[11px] text-[#2C2828] mt-2">
                    <p>{{ pedido.data }}</p>
                    <p>Tamanho: {{ obterTamanho(itemAtual) }}</p>
                    <p>Quantidade: {{ itemAtual.quantidade }}</p>
                </div>

                <p class="mt-2 text-[14px]">
                    Total: R${{ formatarTotal(pedido.total) }}
                </p>
            </div>
        </div>

        <div v-else class="text-sm text-gray-500">
            Nenhum produto encontrado neste pedido.
        </div>

        <div
            v-if="itens.length > 1"
            class="mt-3 flex items-center justify-center gap-2"
        >
            <span
                v-for="(item, index) in itens"
                :key="item.id ?? index"
                class="h-1.5 w-1.5 rounded-full"
                :class="indiceAtual === index ? 'bg-[#0C2645]' : 'bg-gray-300'"
            ></span>

            <span class="ml-1 text-[10px] text-gray-500">
                {{ indiceAtual + 1 }}/{{ itens.length }}
            </span>
        </div>
    </RouterLink>
</template>
