<script setup>
import LocationMap from '@/components/LocationMap.vue'

defineProps({
    tipoEntrega: String,
    enderecoManual: String,
    buscandoEndereco: Boolean,
    loadingLocation: Boolean,
    location: Object,
    locationError: String,
    distanceKm: Number,
    frete: Number,
    formatPrice: Function,
    formatDistance: Function
})

defineEmits([
    'selecionar-entrega',
    'endereco-change',
    'buscar-endereco',
    'buscar-localizacao',
    'abrir-whatsapp'
])
</script>

<template>
    <div class="mb-10">
        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
            ENTREGA
        </h2>

        <div class="mb-5 flex flex-col border border-[#BFC0C0]">
            <button type="button" @click="$emit('selecionar-entrega', 'Vou buscar')"
                class="flex min-h-[58px] items-center justify-between border-b border-[#BFC0C0] px-5 text-left transition"
                :class="tipoEntrega === 'Vou buscar' ? 'bg-gray-200 text-[#0C2645]' : 'text-[#2C2828]'">
                <span>Vou buscar o pedido</span>
                <span class="text-xl">›</span>
            </button>

            <button type="button" @click="$emit('selecionar-entrega', 'Uber Entregas')"
                class="flex min-h-[58px] items-center justify-between px-5 text-left transition"
                :class="tipoEntrega === 'Uber Entregas' ? 'bg-gray-200 text-[#0C2645]' : 'text-[#2C2828]'">
                <span>Uber Entregas</span>
                <span class="text-xl">›</span>
            </button>
        </div>

        <div class="border border-[#BFC0C0] p-5">
            <div class="mb-5">
                <p class="mb-3 text-sm text-[#777]">Endereço para entrega</p>

                <div class="flex gap-2">
                    <input :value="enderecoManual" type="text" placeholder="Digite seu endereço"
                        class="min-w-0 flex-1 border border-[#BFC0C0] px-4 py-3 text-sm text-[#2C2828] outline-none focus:border-[#0C2645]"
                        @input="$emit('endereco-change', $event.target.value)"
                        @keyup.enter="$emit('buscar-endereco')">

                    <button type="button" @click="$emit('buscar-endereco')"
                        :disabled="buscandoEndereco || !enderecoManual.trim()"
                        class="border border-[#0C2645] px-4 text-sm text-[#0C2645] disabled:cursor-not-allowed disabled:opacity-50">
                        {{ buscandoEndereco ? 'Buscando...' : 'Buscar' }}
                    </button>
                </div>

                <button type="button" @click="$emit('buscar-localizacao')" :disabled="loadingLocation"
                    class="mt-3 text-sm text-[#0C2645] underline">
                    {{ loadingLocation ? 'Obtendo localização...' : 'Usar minha localização atual' }}
                </button>
            </div>

            <div class="mb-5">
                <p class="mb-1 text-sm text-[#777]">Endereço selecionado</p>

                <p v-if="location?.label" class="text-sm text-[#2C2828]">
                    {{ location.label }}
                </p>
                <p v-else-if="locationError" class="text-sm text-red-600">
                    {{ locationError }}
                </p>
                <p v-else class="text-sm text-[#777]">
                    Nenhum endereço selecionado.
                </p>
            </div>

            <LocationMap v-if="location" :location="location" />

            <div v-if="distanceKm !== null && tipoEntrega === 'Uber Entregas'"
                class="mt-5 border-t border-[#BFC0C0] pt-4">
                <div class="flex justify-between text-sm text-[#2C2828]">
                    <span>Distância:</span>
                    <span>{{ formatDistance(distanceKm) }} km</span>
                </div>

                <div class="mt-2 flex justify-between text-sm text-[#2C2828]">
                    <span>Frete:</span>
                    <span>R${{ formatPrice(frete) }}</span>
                </div>
            </div>

            <div v-if="tipoEntrega" class="mt-5 border-t border-[#BFC0C0] pt-4">
                <p class="mb-3 text-sm text-[#2C2828]">
                    Combine os detalhes da entrega diretamente com a vendedora.
                </p>

                <button type="button" @click="$emit('abrir-whatsapp')"
                    class="flex w-full items-center justify-center gap-2 bg-[#0C2645] px-5 py-3 text-sm text-white transition hover:bg-[#163657]">
                    Combinar entrega pelo WhatsApp
                </button>
            </div>
        </div>
    </div>
</template>
