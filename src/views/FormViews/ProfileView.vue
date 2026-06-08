<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userInfoStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const pedidos = computed(() => userStore.pedidos)

const mensagemParabens = ref(false)

onMounted(async () => {

  await userStore.fetchUser()

  if (userStore.cadastroRealizado) {
    mensagemParabens.value = true

    setTimeout(() => {
      mensagemParabens.value = false
      userStore.cadastroRealizado = false
    }, 3000)
  }
})

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
<template>
  <div class="min-h-screen bg-[#F8F9F9] mt-30 py-8 px-4 lg:flex lg:justify-between w-full">
    <div class="lg:w-1/3 lg:mr-10 lg:ml-10 lg:mt-10">
      <div class="w-full max-w-[1200px] text-[#2C2828] lg:grid lg:grid-cols-[320px_1fr] lg:gap-14">
        <transition name="fade">
          <div v-if="mensagemParabens" class="text-center mb-10 lg:text-left">
            <h2 class="text-[#0C2645] font-serif text-[28px]">
              Parabéns!
            </h2>
            <p class="text-[18px] text-[#2C2828]">
              Cadastro realizado com sucesso.
            </p>
          </div>
        </transition>
      </div>
      <div class="text-center lg:text-left">
        <p class="text-md text-[#2C2828]">
          Bem vindo(a),
        </p>
        <h1 class="text-lg text-[#0C2645] font-serif uppercase">
          {{ user.name }}
        </h1>
        <div class="border-b border-[#0C2645] mt-2"></div>
      </div>
      <div class="flex gap-4 mt-5 w-full justify-center lg:justify-start">
        <div
          class="w-[165px] h-[165px] border border-gray-300 flex items-center justify-center overflow-hidden bg-white">
          <img v-if="user.foto" :src="user.foto" alt="Foto" class="w-full h-full object-cover">
          <img v-else src="/icons/usuario.svg" alt="Usuário" class="w-14 h-14 object-contain">
        </div>
        <div class="flex flex-col justify-between h-[165px]">
          <ul class="text-[13px] leading-6">
            <li>
              <img src="/icons/calendario.svg" alt="Data de Nascimento" class="inline-block w-4 mr-1">
              {{ user.nascimento }}
            </li>
            <li class="mt-2">
              <img src="/icons/gmail-blue.svg" alt="Email" class="inline-block w-4 mr-1">
              {{ user.email }}
            </li>
            <li class="mt-2">
              <img src="/icons/telefone.svg" alt="Telefone" class="inline-block w-4 mr-1">
              {{ user.telefone }}
            </li>
          </ul>
          <button @click="handleLogout"
            class="flex items-center justify-center mt-2 border border-gray-300 bg-[#0C2645] px-3 py-2 text-[#F8F9F9]">
            <img src="/icons/user-logout-white.svg" alt="Logout">
            <span class="ml-2">Sair da conta</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-8 lg:mt-0 lg:w-2/3 lg:ml-10 lg:mr-10 lg:mt-10">
      <h2 class="text-[#0C2645] font-serif text-lg mb-4">
        MEUS PEDIDOS:
      </h2>
      <div v-if="pedidos.length === 0" class="border border-gray-300 bg-white p-8 lg:p-19 text-center">

        <p class="text-[#0C2645] font-serif">
          Você ainda não possui pedidos.
        </p>

        <p class="text-sm text-gray-500 mt-2">
          Quando você realizar uma compra, ela aparecerá aqui.
        </p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        <div v-for="pedido in pedidos" :key="pedido.id" class="border border-gray-300 p-3 bg-white">
          <div class="flex gap-3">
            <img :src="pedido.imagem" alt="Produto" class="w-[85px] h-[85px] object-cover">
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
</template>