<script setup>
defineProps({
    variacoes: {
        type: Array,
        default: () => []
    },
    selectedPreco: {
        type: Object,
        default: null
    },
    precoFormatado: {
        type: String,
        default: null
    },
    addingToBag: {
        type: Boolean,
        default: false
    },
    addToBagError: {
        type: String,
        default: ''
    }
})

defineEmits(['select', 'add'])
</script>

<template>
    <div v-if="variacoes.length" class="mt-15">
        <p class="text-[#2C2828] text-lg font-semibold mb-2 lg:mb-5">
            Escolha o Tamanho:
        </p>

        <div class="grid grid-cols-3 gap-3 lg:mb-15">
            <button v-for="v in variacoes" :key="v.id" @click="$emit('select', v)"
                class="px-1 py-1 lg:px-20 lg:py-2 border-2 transition-all duration-200" :class="selectedPreco?.id === v.id
                    ? 'bg-[#0C2645] border-[#0C2645] text-white'
                    : 'bg-white border-[#E7EAE9] text-[#2C2828] hover:border-[#0C2645]'">
                <div class="font-semibold">{{ v.tamanho }}</div>
            </button>
        </div>
    </div>

    <div v-if="precoFormatado" class="mt-10 text-[#0C2645] text-2xl font-[Questrial] lg:text-5xl">
        <span class="font-semibold">R$ {{ precoFormatado }}</span>
    </div>

    <div class="mt-3 lg:mt-7">
        <button type="button" @click="$emit('add')" :disabled="addingToBag || !selectedPreco"
            class="w-full mt-6 bg-[#0C2645] text-white py-3 transition-all duration-300 hover:bg-[#183D65] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {{ addingToBag ? 'Adicionando...' : 'Adicionar à sacola' }}
        </button>

        <p v-if="addToBagError" class="mt-3 text-sm text-red-600">
            {{ addToBagError }}
        </p>
    </div>
</template>
