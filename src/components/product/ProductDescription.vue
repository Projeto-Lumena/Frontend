<script setup>
defineProps({
    product: {
        type: Object,
        default: null
    },
    aromaId: {
        type: String,
        default: null
    }
})
</script>

<template>
    <div class="mt-10 lg:mt-15">
        <p class="text-[#2C2828] text-lg font-semibold mb-2">
            Detalhes:
        </p>

        <p class="text-[#2C2828] text-sm lg:text-lg">
            {{ product.descricao }}
        </p>
    </div>

    <RouterLink v-if="aromaId" :to="{ path: '/aromas', hash: `#${aromaId}` }">
        <button class="flex-1 bg-[#0C2645] text-white py-3 px-10 font-semibold mt-3 mt-10">
            Conhecer Aroma
        </button>
    </RouterLink>
</template>
