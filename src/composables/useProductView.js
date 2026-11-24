import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBagStore } from '@/stores/bag.js'
import { useAuthStore } from '@/stores/auth'

export function useProductView() {
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

    return {
        productsStore,
        product,
        produtoVariacoes,
        selectedPreco,
        selecionadaPrecoFormatado,
        addToBagMessage,
        addToBagError,
        addingToBag,
        adicionarASacola,
        aromaId
    }
}