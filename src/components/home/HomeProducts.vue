<script setup>
import CardComponent from '@/components/CardComponent.vue'

defineProps({
    products: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <p v-if="loading">
        Carregando...
    </p>

    <p v-else-if="error">
        {{ error }}
    </p>

    <div v-else-if="products.length > 0"
        class="grid grid-cols-2 m-4 sm:grid-cols-3 sm:m-6 md:grid-cols-4 md:m-10 lg:m-20 lg:gap-4 lg:grid-cols-5">
        <CardComponent v-for="product in products" :key="product.id" :product="product" />
    </div>

    <p v-else-if="!loading && !error" class="text-center text-[#2C2828] m-8">
        Nenhum produto encontrado.
    </p>
</template>
