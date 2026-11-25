<script setup>
defineProps({
    subtotal: Number,
    frete: Number,
    totalPedido: Number,
    fazendoPedido: Boolean,
    podeFazerPedido: Boolean,
    formatPrice: Function
})

defineEmits(['voltar', 'fazer-pedido'])
</script>

<template>
    <aside>
        <div class="border border-[#BFC0C0]">
            <div class="border-b border-[#BFC0C0] px-5 py-4">
                <h2 class="font-[Cinzel] text-2xl text-[#0C2645]">
                    RESUMO
                </h2>
            </div>

            <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                <span>Subtotal:</span>
                <span>R${{ formatPrice(subtotal) }}</span>
            </div>

            <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                <span>Frete:</span>
                <span>R${{ formatPrice(frete) }}</span>
            </div>

            <div class="flex justify-between px-5 py-4 text-2xl text-[#0C2645]">
                <span>Total</span>
                <span>R${{ formatPrice(totalPedido) }}</span>
            </div>
        </div>

        <div class="mt-8 flex gap-4">
            <button type="button" @click="$emit('voltar')"
                class="h-[40px] flex-1 border border-[#0C2645] text-[#0C2645] transition hover:bg-gray-100">
                Voltar
            </button>

            <button type="button" @click="$emit('fazer-pedido')" :disabled="fazendoPedido || !podeFazerPedido"
                class="h-[40px] flex-1 bg-[#0C2645] text-white transition hover:bg-[#163657] disabled:cursor-not-allowed disabled:opacity-50">
                {{ fazendoPedido ? 'Enviando...' : 'Fazer Pedido' }}
            </button>
        </div>
    </aside>
</template>
