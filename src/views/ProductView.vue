<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const route = useRoute()
const productsStore = useProductsStore()

onMounted(async () => {
    if (!productsStore.products?.length) {
        await productsStore.fetchProducts()
    }
})

const product = computed(() =>
    productsStore.products.find((p) => String(p.id) === String(route.params.id))
)

const produtoVariacoes = computed(() => {
    if (!product.value) return []
    const normalizarTamanho = (valor) => {
        if (valor == null) return null
        const s = String(valor).trim().toUpperCase()
        if (s === 'P') return 'P'
        if (s === 'M') return 'M'
        if (s === 'G') return 'G'
        return null
    }

    return productsStore.productVariations.filter((v) => String(v.produto) === String(product.value.id)).map((v) => {
        const tamanho = normalizarTamanho(v.tamanho ?? v.nome ?? v.variacao ?? v.titulo)
        return {
            id: v.id ?? `${v.produto}-${v.tamanho}-${v.preco}`,
            tamanho,
            preco: Number(v.preco),
            raw: v,
        }
    })
})

const selectedPreco = ref(null)
onMounted(() => {
    if (produtoVariacoes.value.length) {
        selectedPreco.value = produtoVariacoes.value[0]
    }
})

const selecionadaPrecoFormatado = computed(() => {
    const p = selectedPreco.value?.preco
    if (!Number.isFinite(Number(p))) return null
    return Number(p).toFixed(2).replace('.', ',')
})

</script>
<template>
    <div class="pt-24 pb-20">
        <div v-if="productsStore.loading" class="px-6 mt-6 text-[#2C2828] font-semibold">
            Carregando...
        </div>
        <div v-else-if="productsStore.error" class="px-6 mt-6 text-[#2C2828] font-semibold">
            {{ productsStore.error }}
        </div>
        <div v-else class="lg:flex md:justify-between lg:justify-around lg:m-20 m-5 grid-cols-2">
            <div class="lg:max-w-[50%]">
                <div v-if="!product" class="px-6 mt-6 text-[#2C2828] font-semibold">
                    Produto não encontrado.
                </div>
                <div v-else>
                    <div class="pt-5 pb-5">
                        <h1 class="text-2xl lg:text-4xl text-center text-[#0C2645] font-[Cinzel] border-b-1 pb-3 mb-3">
                            Vela Aromática - {{ product.nome }}
                        </h1>
                        <div class="border-gray-300 border-3 p-1">
                            <img v-if="product.imagem?.url" :src="product.imagem.url" :alt="product.nome"
                                class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg:max-w-[50%]">
                <div v-if="produtoVariacoes.length" class="mt-5 ">
                    <p class="text-[#2C2828] text-lg font-semibold mb-2 lg:mb-5">Escolha o Tamanho:</p>
                    <div class="grid grid-cols-3 gap-3 lg:mb-25">
                        <button v-for="v in produtoVariacoes" :key="v.id" @click="selectedPreco = v"
                            class="px-1 py-1 lg:px-20 lg:py-2 border-2 transition-all duration-200"
                            :class="selectedPreco?.id === v.id ? 'bg-[#0C2645] border-[#0C2645] text-white' : 'bg-white border-[#E7EAE9] text-[#2C2828] hover:border-[#0C2645]'">
                            <div class="font-semibold">{{ v.tamanho }}</div>
                        </button>
                    </div>
                </div>
                <div v-if="selecionadaPrecoFormatado"
                    class="mt-10 text-[#0C2645] text-3xl font-[Questrial] lg:text-5xl">
                    <span class="font-semibold">R$ {{ selecionadaPrecoFormatado }}</span>
                </div>
                <div class="mt-3 lg:mt-7 flex gap-3">
                    <button class="flex-1 bg-[#0C2645] text-white py-3 font-semibold">
                        Adicionar à sacola
                    </button>
                </div>
                <div class="mt-10 lg:mt-15 ">
                    <p class="text-[#2C2828] text-lg font-semibold mb-2">Detalhes:</p>
                    <p class="text-[#2C2828] text-sm lg:text-lg">
                        {{ product.descricao }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>