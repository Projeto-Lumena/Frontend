<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import Banner from '@/components/BannerComponent.vue'
import { useBannerStore } from '@/stores/useBannerStore'
import CardComponent from '@/components/CardComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'
import InstallButton from '../components/InstallButton.vue';

const route = useRoute();
const router = useRouter()
const store = useBannerStore()
const storeProducts = useProductsStore()

const showLoginMessage = ref(false)

onMounted(() => {
  if (route.query.login === 'success') {
    showLoginMessage.value = true

    setTimeout(() => {
      showLoginMessage.value = false
    }, 4000)

    // Remove o parâmetro da URL sem sair da página
    router.replace({
      path: route.path,
      query: {}
    })
  }
})

onMounted(async () => {
  await storeProducts.fetchProducts()
})

const categoriasMap = {
  1: 'florais',
  3: 'citricos',
  2: 'doces',
  4: 'lembrancinhas'
}

const precosMap = computed(() => {
  const mapa = {}

  storeProducts.productVariations.forEach(v => {
    if (!mapa[v.produto]) mapa[v.produto] = []
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
        precos: precos
      }
    }
  })

  return Object.values(mapa).map(item => {
    const menor = item.precos.length ? Math.min(...item.precos) : 0
    const maior = item.precos.length ? Math.max(...item.precos) : 0

    return {
      ...item,
      precoMin: menor,
      precoMax: maior
    }
  })
})

const filtros = ref({
  ordenacao: '',
  colecoes: []
})

const aplicarFiltros = (dados) => {
  filtros.value = dados
}

const limparFiltros = () => {
  filtros.value = {
    ordenacao: '',
    colecoes: []
  }
}

const productsFiltradas = computed(() => {
  let lista = [...productsAgrupadas.value]

  if (filtros.value.colecoes.length > 0) {
    lista = lista.filter(product =>
      product.categoriaIds.some(id =>
        filtros.value.colecoes.includes(String(id))
      )
    )
  }

  if (filtros.value.ordenacao === 'maior') {
    lista.sort((a, b) => b.precoMax - a.precoMax)
  }

  if (filtros.value.ordenacao === 'menor') {
    lista.sort((a, b) => a.precoMin - b.precoMin)
  }

  if (filtros.value.ordenacao === 'alfabetica') {
    lista.sort((a, b) => a.nome.localeCompare(b.nome))
  }

  if (filtros.value.ordenacao === 'decrescente') {
    lista.sort((a, b) => b.nome.localeCompare(a.nome))
  }

  return lista
})
</script>

<template>
  <Banner :imagens="store.getBanners('home')" />

  <Transition name="fade">
    <div v-if="showLoginMessage" class="bottom-20 md:max-h-15 fixed md:bottom-none md:top-30 md:left-1/2 md:-translate-x-1/2 z-50 flex md:items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-6 py-3 text-green-700 shadow-lg">
      <span class="text-lg">✓</span>
      <span>Login realizado com sucesso! Seja bem-vindo(a).</span>
    </div>
  </Transition>

  <FilterComponent @aplicar="aplicarFiltros" @limpar="limparFiltros" />

  <p v-if="storeProducts.loading">Carregando...</p>
  <p v-else-if="storeProducts.error">{{ storeProducts.error }}</p>

  <div v-else-if="productsFiltradas.length > 0"
    class="grid grid-cols-2 m-4 sm:grid-cols-3 sm:m-6 md:grid-cols-4 md:m-10 lg:m-20 lg:gap-4 lg:grid-cols-5">
    <CardComponent v-for="product in productsFiltradas" :key="product.nome" :product="product" />
  </div>
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