<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="mb-10">
        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
            FORMA DE PAGAMENTO
        </h2>

        <div class="flex flex-col">
            <label
                class="flex h-[55px] cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]"
                :class="modelValue === 'Pix' ? 'border-[#0C2645] bg-gray-200' : ''">
                <input :checked="modelValue === 'Pix'" type="radio" value="Pix" class="sr-only"
                    @change="$emit('update:modelValue', 'Pix')">
                <img src="/icons/pix.svg" alt="Pix" class="mr-4 h-7 w-7 object-contain">
                <span class="text-[#2C2828]">Pix</span>
            </label>

            <label
                class="-mt-px flex h-[55px] cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]"
                :class="modelValue === 'Dinheiro' ? 'border-[#0C2645] bg-gray-200' : ''">
                <input :checked="modelValue === 'Dinheiro'" type="radio" value="Dinheiro" class="sr-only"
                    @change="$emit('update:modelValue', 'Dinheiro')">
                <img src="/icons/dinheiro.svg" alt="Dinheiro" class="mr-4 h-7 w-7 object-contain">
                <span class="text-[#2C2828]">
                    Dinheiro (combinar com a vendedora)
                </span>
            </label>
        </div>
    </div>
</template>
