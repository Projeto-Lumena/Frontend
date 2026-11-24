
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import Banner from '@/components/BannerComponent.vue'
import { useBannerStore } from '@/stores/useBannerStore'
import CardComponent from '@/components/CardComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'
import InstallButton from '../components/InstallButton.vue'

const route = useRoute()
const router = useRouter()
const store = useBannerStore()
const storeProducts = useProductsStore()

const showLoginMessage = ref(false)

const filtros = ref({
  ordenacao: '',
  colecoes: []
})

onMounted(() => {
  if (route.query.login === 'success') {
    showLoginMessage.value = true

    setTimeout(() => {
      showLoginMessage.value = false
    }, 4000)

    router.replace({
      path: route.path,
      query: {}
    })
  }

  storeProducts.fetchProducts()
})

const categoriasMap = {
  1: 'florais',
  3: 'citricos',
  2: 'doces',
  4: 'lembrancinhas'
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

const precosMap = computed(() => {
  const mapa = {}

  storeProducts.productVariations.forEach(v => {
    if (!mapa[v.produto]) {
      mapa[v.produto] = []
    }

    mapa[v.produto].push(Number(v.preco))
  })

  return mapa
})

const productsAgrupadas = computed(() => {
  const mapa = {}

  storeProducts.products.forEach(produto => {
    const precos = precosMap.value[produto.id] || []

    if (!mapa[produto.nome]) {
      mapa[produto.nome] = {
        id: produto.id,
        nome: produto.nome,
        imagem: produto.imagem,
        categoriaIds: produto.categorias || [],
        categoria: produto.categorias
          ?.map(id => categoriasMap[id])
          .filter(Boolean) || [],
        precos: precos,
        aroma: aromasPorProduto[produto.nome],
        variacoes: storeProducts.productVariations.filter(
          v => String(v.produto) === String(produto.id)
        )
      }
    }
  })

  return Object.values(mapa).map(item => {
    const menor = item.precos.length
      ? Math.min(...item.precos)
      : 0

    const maior = item.precos.length
      ? Math.max(...item.precos)
      : 0

    return {
      ...item,
      precoMin: menor,
      precoMax: maior
    }
  })
})

const aplicarFiltros = async (dados) => {
  filtros.value = dados

  const parametros = {}

  // Converte a ordenação da interface para o parâmetro da API.
  const ordenacoes = {
    maior: '-preco_max',
    menor: 'preco_min',
    alfabetica: 'nome',
    decrescente: '-nome'
  }

  if (dados.ordenacao) {
    parametros.ordering = ordenacoes[dados.ordenacao]
  }

  // Envia as categorias selecionadas como IDs separados por vírgula.
  if (dados.colecoes.length > 0) {
    parametros.categorias = dados.colecoes.join(',')
  }

  await storeProducts.fetchProducts(parametros)
}

const limparFiltros = async () => {
  filtros.value = {
    ordenacao: '',
    colecoes: []
  }

  await storeProducts.fetchProducts()
}

const productsFiltradas = computed(() => {
  return productsAgrupadas.value
})
</script>

<template>
  <Banner :imagens="store.getBanners('home')" />

  <Transition name="fade">
    <div
      v-if="showLoginMessage"
      class="top-5 md:bottom-auto md:top-30 left-1/2 -translate-x-1/2 fixed z-[110] flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-green-700 shadow-lg"
    >
      <span class="text-lg">✓</span>
      <span>Login realizado com sucesso! Seja bem-vindo(a).</span>
    </div>
  </Transition>

  <FilterComponent
    @aplicar="aplicarFiltros"
    @limpar="limparFiltros"
  />

  <p v-if="storeProducts.loading">
    Carregando...
  </p>

  <p v-else-if="storeProducts.error">
    {{ storeProducts.error }}
  </p>

  <div
    v-else-if="productsFiltradas.length > 0"
    class="grid grid-cols-2 m-4 sm:grid-cols-3 sm:m-6 md:grid-cols-4 md:m-10 lg:m-20 lg:gap-4 lg:grid-cols-5"
  >
    <CardComponent
      v-for="product in productsFiltradas"
      :key="product.id"
      :product="product"
    />
  </div>

  <p
    v-else-if="!storeProducts.loading && !storeProducts.error"
    class="text-center text-[#2C2828] m-8"
  >
    Nenhum produto encontrado.
  </p>

  <InstallButton />
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
