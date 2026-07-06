<script setup>
import Input from '@/components/FormComponents/InputComponent.vue'
import Button from '@/components/FormComponents/ButtonComponent.vue'
import { useInputStore } from '@/stores/userInputStore'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authApi from '@/api/authApi'

const authStore = useAuthStore();
const router = useRouter();
const store = useInputStore()

async function handleRegister() {
  store.resetErrors();

  let possuiErro = false;

  if (!store.campos.userInputNome.value.trim()) {
    store.campos.userInputNome.error = 'Informe seu nome completo.';
    possuiErro = true;
  }

  if (!store.campos.userInputDataNascimento.value) {
    store.campos.userInputDataNascimento.error = 'Informe sua data de nascimento.';
    possuiErro = true;
  }

  if (!store.campos.userInputTelefone.value.trim()) {
    store.campos.userInputTelefone.error = 'Informe seu telefone.';
    possuiErro = true;
  }

  if (!store.campos.userInputEmail.value.trim()) {
    store.campos.userInputEmail.error = 'Informe seu e-mail.';
    possuiErro = true;
  }

  if (!store.campos.userInputSenha.value.trim()) {
    store.campos.userInputSenha.error = 'Informe sua senha.';
    possuiErro = true;
  }

  if (possuiErro) {
    return;
  }

  try {

    const userData = {
      name: store.campos.userInputNome.value,
      email: store.campos.userInputEmail.value,
      telefone: store.campos.userInputTelefone.value,
      nascimento: store.campos.userInputDataNascimento.value,
      password: store.campos.userInputSenha.value,
    };

    await authStore.register(userData);

    store.resetForm();

    // Vai para o perfil
    router.push({
      path: '/perfil',
      query: {
        cadastro: 'success'
      }
    });

  } catch (err) {
    const errors = err.response?.data;

    if (!errors) {
      console.error(err);
      return;
    }

    Object.keys(errors).forEach((campo) => {
      switch (campo) {
        case 'name':
          store.campos.userInputNome.error = errors[campo][0];
          break;

        case 'email':
          store.campos.userInputEmail.error = errors[campo][0];
          break;

        case 'telefone':
          store.campos.userInputTelefone.error = errors[campo][0];
          break;

        case 'nascimento':
          store.campos.userInputDataNascimento.error = errors[campo][0];
          break;

        case 'password':
          store.campos.userInputSenha.error = errors[campo][0];
          break;
      }
    });
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row mt-20 lg:mt-10">
    <div class="w-full lg:w-1/2 flex-col px-6 lg:px-30">
      <div class="max-w-lg mx-auto w-full mt-20 lg:mt-40">
        <h1 class="text-3xl md:text-4xl lg:text-5xl text-center text-[#0C2645] font-[Cinzel]">Cadastro</h1>
        <Input v-for="(campo, key) in store.campos" :key="key" :campo="campo"
          @update="(value) => campo.value = value" />
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between my-10">
          <Button label="Limpar" variant="azul" @click="store.resetForm" />
          <Button label="Cadastrar-me" @click="handleRegister" />
        </div>
      </div>
    </div>
    <div class="hidden lg:block lg:w-1/2 h-screen">
      <img src="/img/imgCadastro.png" alt="" class="w-full h-full object-cover">
    </div>
  </div>
</template>