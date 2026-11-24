<script setup>

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBagStore } from '@/stores/bag.js'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const bagStore = useBagStore()
const authStore = useAuthStore()

const addToBagMessage = ref(false)
const addToBagError = ref('')
const addingToBag = ref(false)

onMounted(async () => {
    if (!productsStore.products?.length) {
        await productsStore.fetchProducts()
    }
})

const product = computed(() =>
    productsStore.products.find(
        p => String(p.id) === String(route.params.id)
    )
)

const produtoVariacoes = computed(() => {
    if (!product.value) return []

    const normalizarTamanho = valor => {
        if (valor == null) return null

        const tamanho = String(valor).trim().toUpperCase()

        return ['P', 'M', 'G'].includes(tamanho) ? tamanho : null
    }

    return productsStore.productVariations
        .filter(v => String(v.produto) === String(product.value.id))
        .map(v => ({
            id: v.id,
            tamanho: normalizarTamanho(
                v.tamanho ?? v.nome ?? v.variacao ?? v.titulo
            ),
            preco: Number(v.preco),
            raw: v
        }))
        .filter(v => v.id != null && v.tamanho != null)
})

const selectedPreco = ref(null)

watch(
    produtoVariacoes,
    variacoes => {
        if (!variacoes.length) {
            selectedPreco.value = null
            return
        }

        const atualAindaExiste = variacoes.some(
            v => v.id === selectedPreco.value?.id
        )

        if (!atualAindaExiste) {
            selectedPreco.value = variacoes[0]
        }
    },
    { immediate: true }
)

const selecionadaPrecoFormatado = computed(() => {
    const preco = selectedPreco.value?.preco

    if (!Number.isFinite(Number(preco))) return null

    return Number(preco).toFixed(2).replace('.', ',')
})

async function adicionarASacola() {
    if (!product.value || !selectedPreco.value || addingToBag.value) return

    addToBagError.value = ''
    addToBagMessage.value = false

    if (!authStore.isAuthenticated) {
        await router.push({
            name: 'login',
            query: { redirect: route.fullPath }
        })
        return
    }

    addingToBag.value = true

    try {
        await bagStore.addToBag({
            id: selectedPreco.value.id,
            produtoId: product.value.id,
            nome: product.value.nome,
            tamanho: selectedPreco.value.tamanho,
            preco: selectedPreco.value.preco,
            imagem: product.value.imagem?.url
        })

        addToBagMessage.value = true

        setTimeout(() => {
            addToBagMessage.value = false
        }, 4000)
    } catch (error) {
        console.error('Erro ao adicionar produto à sacola:', error)

        addToBagError.value =
            error.response?.data?.detail ||
            error.response?.data?.itens?.[0] ||
            error.message ||
            'Não foi possível adicionar o produto à sacola.'
    } finally {
        addingToBag.value = false
    }
}

const aromasPorProduto = {
    'Bergamota': 'bergamota',
    'Capim Limão': 'capim-limao',
    'Flor de Laranjeira': 'flor-de-laranjeira',
    'Jasmim': 'jasmim',
    'Lavanda Francesa': 'lavanda-francesa',
    'Limão Siciliano': 'limao-siciliano',
    'Canela': 'canela',
    'Baunilha': 'baunilha',
    'Flor de Cerejeira': 'flor-de-cerejeira',
    'Maçã e Canela': 'maca-e-canela'
}
const aromaId = computed(() => {
    return aromasPorProduto[product.value?.nome] || null
})
</script>
<template>
    <Transition name="fade">
        <div v-if="addToBagMessage"
            class="top-5 md:bottom-auto md:top-30 left-1/2 -translate-x-1/2 fixed z-[110] flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-green-700 shadow-lg">
            <span class="text-lg">✓</span>
            <span>
                Produto adicionado à sacola!
            </span>
        </div>
    </Transition>
    <div class="pb-20 md:pt-10">
        <div v-if="productsStore.loading" class="px-6 mt-6 text-[#2C2828] font-semibold">
            Carregando...
        </div>
        <div v-else-if="productsStore.error" class="px-6 mt-6 text-[#2C2828] font-semibold">
            {{ productsStore.error }}
        </div>
        <div v-else class="lg:flex lg:gap-16 lg:m-20 m-5 grid-cols-2">
            <div class="lg:w-1/2">
                <div v-if="!product" class="px-6 mt-6 text-[#2C2828] font-semibold">
                    Produto não encontrado.
                </div>
                <div v-else>
                    <div class="pt-2 pb-5">
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
            <div class="lg:w-1/2">
                <div v-if="produtoVariacoes.length" class="mt-15">
                    <p class="text-[#2C2828] text-lg font-semibold mb-2 lg:mb-5">Escolha o Tamanho:</p>
                    <div class="grid grid-cols-3 gap-3 lg:mb-15">
                        <button v-for="v in produtoVariacoes" :key="v.id" @click="selectedPreco = v"
                            class="px-1 py-1 lg:px-20 lg:py-2 border-2 transition-all duration-200"
                            :class="selectedPreco?.id === v.id ? 'bg-[#0C2645] border-[#0C2645] text-white' : 'bg-white border-[#E7EAE9] text-[#2C2828] hover:border-[#0C2645]'">
                            <div class="font-semibold">{{ v.tamanho }}</div>
                        </button>
                    </div>
                </div>
                <div v-if="selecionadaPrecoFormatado"
                    class="mt-10 text-[#0C2645] text-2xl font-[Questrial] lg:text-5xl">
                    <span class="font-semibold">R$ {{ selecionadaPrecoFormatado }}</span>
                </div>
                <div class="mt-3 lg:mt-7">
                    <button type="button" @click="adicionarASacola" :disabled="addingToBag || !selectedPreco"
                        class="w-full bg-[#0C2645] text-white py-3 font-semibold disabled:opacity-60">
                        {{ addingToBag ? 'Adicionando...' : 'Adicionar à sacola' }}
                    </button>

                    <p v-if="addToBagError" class="mt-3 text-sm text-red-600">
                        {{ addToBagError }}
                    </p>
                </div>

                <div class="mt-10 lg:mt-15 ">
                    <p class="text-[#2C2828] text-lg font-semibold mb-2">Detalhes:</p>
                    <p class="text-[#2C2828] text-sm lg:text-lg">
                        {{ product.descricao }}
                    </p>
                </div>
                <RouterLink v-if="aromaId" :to="{ path: '/aromas', hash: `#${aromaId}` }">
                    <button class="flex-1 bg-[#0C2645] text-white py-3 px-10 font-semibold mt-3 mt-10 ">
                        Conhecer Aroma
                    </button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>