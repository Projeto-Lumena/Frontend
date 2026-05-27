<script setup>
import { computed } from 'vue'
import Input from '@/components/FormComponents/InputComponent.vue'
import Button from '@/components/FormComponents/ButtonComponent.vue'
import { useInputStore } from '@/stores/userInputStore'

const store = useInputStore()
const loginFields = computed(() => {
  return Object.values(store.campos).filter(
    campo =>
      campo.type === 'email' ||
      campo.type === 'password'
  )
})

const submit = async () => {
  try {
    console.log('Login')

  } catch (error) {
    console.log(error)
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
        <Input v-for="(campo, key) in loginFields" :key="key" :campo="campo" @update="(value) => campo.value = value" />
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between my-10">
          <Button label="Limpar" variant="azul" @click="store.resetForm" />
          <Button label="Fazer Login" @click="submit" />
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