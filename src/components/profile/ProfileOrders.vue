<script setup>
import OrderCard from '@/components/OrderCard.vue'

defineProps({
    pedidos: {
        type: Array,
        default: () => []
    }
})
</script>

<template>
    <div>
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
            <OrderCard v-for="pedido in pedidos" :key="pedido.id" :pedido="pedido" />
        </div>
    </div>
</template>
