
<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBagStore } from '@/stores/bag.js'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  product: Object
})

const router = useRouter()
const route = useRoute()
const bagStore = useBagStore()
const authStore = useAuthStore()

const mostrarTamanhos = ref(false)
const tamanhoSelecionado = ref(null)

const addToBagMessage = ref(false)
const addToBagError = ref('')
const addingToBag = ref(false)

let timeoutMensagem = null

const variacoes = computed(() => {
  if (!props.product?.variacoes) return []

  return props.product.variacoes.map(v => ({
    id: v.id,
    tamanho: String(v.tamanho ?? '').trim().toUpperCase(),
    preco: Number(v.preco)
  }))
})

function abrirTamanhos(event) {
  event.preventDefault()
  event.stopPropagation()

  addToBagError.value = ''
  mostrarTamanhos.value = true

  if (variacoes.value.length) {
    tamanhoSelecionado.value = variacoes.value[0]
  }
}

function fecharTamanhos() {
  mostrarTamanhos.value = false
}

async function adicionarASacola() {
  if (!tamanhoSelecionado.value || addingToBag.value) return

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
      id: tamanhoSelecionado.value.id,
      produtoId: props.product.id,
      nome: props.product.nome,
      tamanho: tamanhoSelecionado.value.tamanho,
      preco: tamanhoSelecionado.value.preco,
      imagem: props.product.imagem?.url
    })

    fecharTamanhos()
    addToBagMessage.value = true

    if (timeoutMensagem) {
      clearTimeout(timeoutMensagem)
    }

    timeoutMensagem = setTimeout(() => {
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

onUnmounted(() => {
  if (timeoutMensagem) {
    clearTimeout(timeoutMensagem)
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="addToBagMessage"
      class="fixed top-5 md:bottom-auto md:top-30 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-green-700 shadow-lg"
    >
      <span class="text-lg">✓</span>
      <span>Produto adicionado à sacola!</span>
    </div>
  </Transition>

  <div class="m-2 border text-center border-[#E7EAE9] p-1 hover:shadow-xl">
    <RouterLink :to="{ name: 'produto', params: { id: product.id } }">
      <img
        :src="product.imagem?.url"
        :alt="product.nome"
        class="w-full object-cover mb-2"
      />

      <h2 class="mb-4">
        Vela Aromática {{ product.nome }}
      </h2>
    </RouterLink>

    <div class="flex items-center justify-between px-4 pb-2">
      <p class="text-[#2C2828] text-sm font-semibold">
        R$ {{ product.precoMin.toFixed(2).replace('.', ',') }}
        -
        R$ {{ product.precoMax.toFixed(2).replace('.', ',') }}
      </p>

      <button
        type="button"
        @click="abrirTamanhos"
        class="flex items-center justify-center"
      >
        <img
          src="/icons/sacolaAzul.png"
          alt="Sacola"
          class="w-6 h-6 cursor-pointer"
        >
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="mostrarTamanhos"
        class="fixed inset-0 z-[120] flex items-end justify-center bg-black/30 sm:items-center"
        @click.self="fecharTamanhos"
      >
        <div class="w-full max-w-md bg-white p-6 shadow-xl sm:rounded-lg">

          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-[#0C2645]">
              Escolha o tamanho
            </h3>

            <button
              type="button"
              @click="fecharTamanhos"
              class="text-2xl text-[#0C2645]"
            >
              ×
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="variacao in variacoes"
              :key="variacao.id"
              type="button"
              @click="tamanhoSelecionado = variacao"
              class="border p-3 transition"
              :class="tamanhoSelecionado?.id === variacao.id
                ? 'border-[#0C2645] bg-[#0C2645] text-white'
                : 'border-[#E7EAE9] text-[#2C2828] hover:border-[#0C2645]'"
            >
              <span class="block font-semibold">
                {{ variacao.tamanho }}
              </span>

              <span class="block text-sm mt-1">
                R$ {{ variacao.preco.toFixed(2).replace('.', ',') }}
              </span>
            </button>
          </div>

          <button
            type="button"
            @click="adicionarASacola"
            :disabled="!tamanhoSelecionado || addingToBag"
            class="w-full mt-6 bg-[#0C2645] text-white py-3 transition-all duration-300 hover:bg-[#183D65] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ addingToBag ? 'Adicionando...' : 'Adicionar à sacola' }}
          </button>

          <p v-if="addToBagError" class="mt-3 text-sm text-red-600">
            {{ addToBagError }}
          </p>
        </div>
      </div>
    </Transition>
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
