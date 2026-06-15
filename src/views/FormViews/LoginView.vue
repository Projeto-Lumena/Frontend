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
      'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="min-h-screen flex flex-col lg:flex-row mt-20 lg:mt-10">
    <div class="w-full lg:w-1/2 flex-col px-6 lg:px-15">
      <div class="max-w-md mx-auto lg:my-20 w-full mt-20 lg:mt-40">
        <h1 class="text-2xl text-center text-[#0C2645] font-[Cinzel]">
          Login
        </h1>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <Input v-for="(campo, key) in loginFields" :key="key" :campo="campo" @update="(value) => campo.value = value" />
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
    <div class="hidden lg:flex lg:w-1/2 h-screen justify-end">
      <img src="/img/imgCadastro.png" alt="">
    </div>
  </div>
</template>