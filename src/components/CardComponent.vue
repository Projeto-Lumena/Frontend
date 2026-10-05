<script setup>
import { ref, computed } from 'vue'
import { useBagStore } from '@/stores/bag.js'

const props = defineProps({
  product: Object
})

const bagStore = useBagStore()

const mostrarTamanhos = ref(false)
const tamanhoSelecionado = ref(null)

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

  mostrarTamanhos.value = true

  if (variacoes.value.length) {
    tamanhoSelecionado.value = variacoes.value[0]
  }
}

function fecharTamanhos() {
  mostrarTamanhos.value = false
}

function adicionarASacola() {
  if (!tamanhoSelecionado.value) return

  bagStore.addToBag({
    id: tamanhoSelecionado.value.id,
    produtoId: props.product.id,
    nome: props.product.nome,
    tamanho: tamanhoSelecionado.value.tamanho,
    preco: tamanhoSelecionado.value.preco,
    imagem: props.product.imagem?.url
  })

  fecharTamanhos()
}
</script>

<template>
  <div class="m-2 border text-center border-[#E7EAE9] p-1 hover:shadow-xl">
    <RouterLink :to="{ name: 'produto', params: { id: product.id } }" >
      <img :src="product.imagem.url" :alt="product.nome" class="w-full object-cover mb-2" />

      <h2 class="mb-4">  Vela Aromática {{ product.nome }} </h2>
    </RouterLink>
    <div class="flex items-center justify-between px-2 pb-2">
      <p class="text-[#2C2828] text-sm font-semibold">
        R$ {{ product.precoMin.toFixed(2).replace('.', ',') }} - R$ {{ product.precoMax.toFixed(2).replace('.', ',') }}
      </p>
      <button @click="abrirTamanhos" class="flex items-center justify-center ">
        <img src="/icons/sacolaAzul.png" alt="Sacola" class="w-6 h-6 cursor-pointer">
      </button>
    </div>
    <Transition name="fade">
      <div v-if="mostrarTamanhos" class="fixed inset-0 z-[120] flex items-end justify-center bg-black/30 sm:items-center" @click.self="fecharTamanhos">
        <div class="w-full max-w-md bg-white p-6 shadow-xl sm:rounded-lg">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-[#0C2645]">  Escolha o tamanho </h3>
            <button type="button" @click="fecharTamanhos" class="text-2xl text-[#0C2645]" >  ×
            </button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <button v-for="variacao in variacoes" :key="variacao.id" type="button" @click="tamanhoSelecionado = variacao" class="border p-3 transition" :class="tamanhoSelecionado?.id === variacao.id ? 'border-[#0C2645] bg-[#0C2645] text-white' : 'border-[#E7EAE9] text-[#2C2828] hover:border-[#0C2645]'">
              <span class="block font-semibold"> {{ variacao.tamanho }} </span>
              <span class="block text-sm mt-1"> R$ {{ variacao.preco.toFixed(2).replace('.', ',') }}</span>
            </button>
          </div>
          <button type="button" @click="adicionarASacola" :disabled="!tamanhoSelecionado" class="w-full mt-6 bg-[#0C2645] text-white py-3 transition disabled:opacity-50" > Adicionar à sacola
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
