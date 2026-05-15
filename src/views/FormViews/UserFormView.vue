<script setup>
import Input from '@/components/FormComponents/InputComponent.vue'
import Button from '@/components/FormComponents/ButtonComponent.vue'
import { useInputStore } from '@/stores/UserInputStore'

const store = useInputStore()
const submit = async () => {
  try {
    const payload = store.getPayload()

    console.log('Enviando para API:', payload)

  } catch (error) {
    store.setErrors(error.response.data)
  }
}
</script>
<template>
  <div class="min-h-screen flex flex-col lg:flex-row mt-20 lg:mt-10">
    <div class="w-full lg:w-1/2 flex-col px-6 lg:px-30">
      <div class="max-w-lg mx-auto w-full mt-20 lg:mt-30">
        <h1 class="text-2xl text-center text-[#0C2645] font-[Cinzel]">Cadastro</h1>
        <Input v-for="(campo, key) in store.campos" :key="key" :campo="campo"
          @update="(value) => campo.value = value" />
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between my-10">
          <Button label="Limpar" variant="azul" @click="store.resetForm" />
          <Button label="Cadastrar-me" @click="submit" />
        </div>
      </div>
    </div>
    <div class="hidden lg:flex lg:w-1/2 h-screen justify-end">
      <img src="/img/imgCadastro.png" alt="">
    </div>
  </div>
</template>