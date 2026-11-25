<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBagStore } from '@/stores/bag'
import { useUserStore } from '@/stores/userInfoStore'

import { useOrder } from '@/composables/useOrder'
import { useOrderLocation } from '@/composables/useOrderLocation'
import { useOrderSubmission } from '@/composables/useOrderSubmission'

import OrderProducts from '@/components/order/OrderProducts.vue'
import OrderPayment from '@/components/order/OrderPayment.vue'
import OrderDelivery from '@/components/order/OrderDelivery.vue'
import OrderSummary from '@/components/order/OrderSummary.vue'

const userStore = useUserStore()
const router = useRouter()
const bagStore = useBagStore()

const metodoPagamento = ref('')
const tipoEntrega = ref('')

const locationData = useOrderLocation(
    tipoEntrega,
    metodoPagamento
)

const {
    location,
    loadingLocation,
    locationError,
    enderecoManual,
    buscandoEndereco,
    distanceKm,
    buscarLocalizacao,
    buscarEnderecoManual,
    selecionarEntrega,
    abrirWhatsApp
} = locationData

const {
    frete,
    totalPedido,
    podeFazerPedido,
    formatPrice,
    formatDistance
} = useOrder(
    bagStore,
    location,
    distanceKm,
    metodoPagamento,
    tipoEntrega
)

const { fazendoPedido, fazerPedido } = useOrderSubmission({
    bagStore,
    userStore,
    router,
    metodoPagamento,
    tipoEntrega,
    location,
    enderecoManual,
    distanceKm,
    frete,
    totalPedido,
    podeFazerPedido
})

function voltar() {
    router.push({ name: 'sacola' })
}

onMounted(async () => {
    if (!bagStore.items.length) {
        router.push({ name: 'sacola' })
        return
    }

    if (!userStore.user.id) {
        await userStore.fetchUser()
    }
})
</script>

<template>
    <main class="min-h-screen bg-white px-5 pb-20 pt-18 md:px-10 md:pt-[175px]">
        <section class="mx-auto max-w-[1250px]">
            <div class="mb-10 border-b border-[#0C2645] pb-5">
                <h1 class="text-center font-[Cinzel] text-3xl text-[#0C2645] md:text-4xl lg:text-4xl">
                    FAZER PEDIDO
                </h1>
            </div>

            <div class="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_400px] lg:gap-[100px]">
                <section>
                    <OrderProducts :items="bagStore.items" :format-price="formatPrice" />

                    <OrderPayment v-model="metodoPagamento" />

                    <OrderDelivery :tipo-entrega="tipoEntrega" :endereco-manual="enderecoManual"
                        :buscando-endereco="buscandoEndereco" :loading-location="loadingLocation" :location="location"
                        :location-error="locationError" :distance-km="distanceKm" :frete="frete"
                        :format-price="formatPrice" :format-distance="formatDistance"
                        @selecionar-entrega="selecionarEntrega" @endereco-change="enderecoManual = $event"
                        @buscar-endereco="buscarEnderecoManual" @buscar-localizacao="buscarLocalizacao"
                        @abrir-whatsapp="abrirWhatsApp" />
                </section>

                <OrderSummary :subtotal="bagStore.subtotal" :frete="frete" :total-pedido="totalPedido"
                    :fazendo-pedido="fazendoPedido" :pode-fazer-pedido="podeFazerPedido" :format-price="formatPrice"
                    @voltar="voltar" @fazer-pedido="fazerPedido" />
            </div>
        </section>
    </main>
</template>
