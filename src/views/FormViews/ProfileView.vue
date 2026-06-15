<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userInfoStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const pedidos = computed(() => userStore.pedidos)
const mensagemParabens = ref(false)

onMounted(() => {
  if (userStore.cadastroRealizado) {
    mensagemParabens.value = true

    setTimeout(() => {
      mensagemParabens.value = false
      userStore.cadastroRealizado = false
    }, 3000)
  }
})
</script>
<template>
  <div class="min-h-screen bg-[#f5f5f5] mt-30 flex justify-center py-8 px-4">
    <div class="w-full max-w-[1200px] text-[#2C2828] lg:grid lg:grid-cols-[320px_1fr] lg:gap-14">
      <div>
        <transition nome="fade">
          <div v-if="mensagemParabens" class="text-center mb-10 lg:text-left">
            <h2 class="text-[#0C2645] font-serif text-[28px]">
              Parabéns!
            </h2>
            <p class="text-[18px] text-[#2C2828]">
              Cadastro realizado com sucesso.
            </p>
          </div>
        </transition>
        <div class="text-center lg:text-left">
          <p class="text-md text-[#2C2828]">
            Bem vindo,
          </p>
          <h1 class="text-lg text-[#0C2645] font-serif uppercase">
            {{ user.nome }}
          </h1>
          <div class="border-b border-[#0C2645] mt-2 w-full"></div>
        </div>
        <div class="flex gap-4 mt-5 lg:flex-col lg:items-start">
          <div
            class="w-[110px] h-[110px] border border-gray-300 flex items-center justify-center overflow-hidden bg-white">
            <img v-if="user.photo" :src="user.photo" alt="Foto" class="w-full h-full object-cover">
            <img v-else src="../public/icons/usuario.svg" alt="Usuário"
              class="w-14 h-14 object-contain opacity-100 text-[#2C2828]">
          </div>
          <div class="text-[13px] leading-6">
            <p>
              <span class="font-medium">Data de Nascimento:</span><br>
              {{ user.birthdata }}
            </p>
            <p class="mt-2"> Gmail: {{ user.email }}</p>
            <p> Telefone: {{ user.phone }}</p>
          </div>
        </div>
      </div>
      <div class="mt-8 lg:mt-0">
        <h2 class="text-[#0C2645] font-serif text-lg mb-4">
          MEUS PEDIDOS:
        </h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          <div v-for="pedido in pedidos" :key="pedido.id" class="border border-gray-300 p-3 bg-white">
            <div class="flex gap-3">
              <img :src="pedido.image" alt="Produto" class="w-[85px] h-[85px] object-cover">
              <div class="flex-1">
                <div class="flex justify-between gap-2">
                  <h3 class="text-[14px] leading-4">
                    {{ pedido.nome }}
                  </h3>
                  <span class="text-[10px] text-[#2C2828] whitespace-nowrap">
                    {{ pedido.status }}
                  </span>
                </div>
                <div class="text-[11px] text-[#2C2828] mt-2">
                  <p>{{ pedido.data }}</p>
                  <p>Tamanho: {{ pedido.tamanho }}</p>
                  <p>Quantidade: {{ pedido.quantidade }}</p>
                </div>
                <p class="mt-2 text-[14px]">
                  Total: {{ pedido.total }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>