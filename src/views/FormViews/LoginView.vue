<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import Input from '@/components/FormComponents/InputComponent.vue'
import Button from '@/components/FormComponents/ButtonComponent.vue'

import { useInputStore } from '@/stores/userInputStore'
import { useAuthStore } from '@/stores/auth';

const router = useRouter();

const store = useInputStore()
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
let errorTimeout = null;

const loginFields = computed(() => {
  return Object.values(store.campos).filter(
    campo =>
      campo.type === 'email' ||
      campo.type === 'password'
  )
})

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';

  // Evita vários timers ao clicar várias vezes
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  try {
    const email = store.campos.userInputEmail.value;
    const password = store.campos.userInputSenha.value;

    await authStore.login(email, password);

    router.push({
      path: '/',
      query: {
        login: 'success'
      }
    });
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail ??
      'Não foi possível fazer login. Verifique se o e-mail e a senha estão corretos e tente novamente.';

    errorTimeout = setTimeout(() => {
      errorMessage.value = '';
    }, 5000);

  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="min-h-screen flex flex-col lg:flex-row md:mt-20 lg:mt-10">
    <div class="w-full lg:w-1/2 flex-col px-6 lg:px-15">
      <div class="max-w-md mx-auto lg:my-20 w-full mt-15 md:mt-20 lg:mt-40">
        <h1 class="text-3xl text-center text-[#0C2645] font-[Cinzel] md:text-4xl lg:text-5xl">
          Login
        </h1>
        <Input v-for="(campo, key) in loginFields" :key="key" :campo="campo" @update="(value) => campo.value = value" />
        <div v-if="errorMessage"
          class="mb-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between my-10">
          <Button label="Fazer Login" variant="azul" @click="handleLogin" />
          <Button label="Limpar" @click="store.resetForm" />
        </div>
        <p class="mb-1">Ainda não possui um cadastro?</p>
        <RouterLink to="userForm">
          <Button label="Ir para página de Cadastro"> </Button>
        </RouterLink>
      </div>
    </div>
    <div class="hidden lg:block lg:w-1/2 h-screen">
      <img src="/img/imgCadastro.png" alt="" class="w-full h-full object-cover">
    </div>
  </div>
</template>