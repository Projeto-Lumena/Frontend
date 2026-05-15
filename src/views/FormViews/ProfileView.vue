<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { ref } from 'vue'

const user = ref({
  name: 'Nome Sobrenome',
  email: 'gmail@gmail.com',
  phone: '(00) 00000-0000'
})

const orders = ref([
  {
    id: 1,
    name: 'Vela Aromática Flor de Laranjeira',
    total: 'R$130,00'
  },
  {
    id: 2,
    name: 'Vela Aromática Capim Limão',
    total: 'R$140,00'
  }
])
</script>
<template>
  <div>
    <AppHeader />
    <div class="max-w-md mx-auto mt-6 space-y-4">
      <h1 class="text-xl font-semibold">
        Bem vindo, {{ user.name }}
      </h1>
      <div class="border p-4 rounded">
        <p>Email: {{ user.email }}</p>
        <p>Telefone: {{ user.phone }}</p>
      </div>
      <h2 class="font-semibold">MEUS PEDIDOS:</h2>
      <div
        v-for="order in orders"
        :key="order.id"
        class="border p-3 rounded"
      >
        <p class="font-medium">{{ order.name }}</p>
        <p class="text-sm">Total: {{ order.total }}</p>
      </div>
      <p class="text-center text-green-600">
        PARABÉNS! Cadastro realizado com sucesso.
      </p>
    </div>
  </div>
</template>