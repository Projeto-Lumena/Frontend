<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pedido = ref(null)
const loading = ref(true)
const error = ref('')

const statusSteps = [
    {
        value: 'Finalizado',
        title: 'Pedido Realizado',
        description: 'Pedido realizado, aguardando pagamento.'
    },
    {
        value: 'Pago',
        title: 'Pagamento Realizado',
        description: 'Pedido pago, aguardando entrega.'
    },
    {
        value: 'Entregue',
        title: 'Entregue',
        description: 'Pedido entregue.'
    }
]

const currentStatusIndex = computed(() => {
    if (!pedido.value?.status) return -1

    return statusSteps.findIndex(
        step => step.value === pedido.value.status
    )
})

function isCompleted(index) {
    return currentStatusIndex.value >= index
}

function formatPrice(value) {
    const numero = Number(value)

    if (isNaN(numero)) return '0,00'

    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

async function carregarPedido() {
    try {
        error.value = ''

        const id = route.params.id
        const pedidoSalvo = localStorage.getItem(`lumena-pedido-${id}`)

        if (!pedidoSalvo) {
            error.value = 'Pedido não encontrado.'
            return
        }

        pedido.value = JSON.parse(pedidoSalvo)
    } catch (err) {
        console.error('Erro ao carregar pedido:', err)
        error.value = 'Não foi possível carregar o pedido.'
    } finally {
        loading.value = false
    }
}

function cancelarPedido() {
    console.log('Cancelar pedido:', pedido.value?.id)
}

function comprarNovamente() {
    router.push('/')
}

onMounted(carregarPedido)
</script>

<template>
    <main v-if="loading" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <div class="flex min-h-[500px] items-center justify-center text-[#0C2645]">
            Carregando pedido...
        </div>
    </main>
    <main v-else-if="error" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <div class="mx-auto max-w-[700px] py-20 text-center">
            <p class="mb-6 text-[#2C2828]">{{ error }}</p>
            <button type="button" @click="carregarPedido" class="border border-[#0C2645] px-8 py-3 text-[#0C2645]"> Tentar novamente </button>
        </div>
    </main>
    <main v-else-if="pedido" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <section class="mx-auto max-w-[1250px]">
            <div class="grid grid-cols-1 gap-16 lg:grid-cols-[450px_1fr] lg:gap-[130px]">
                <section>
                    <div class="mb-9 flex items-center gap-8 border-b border-[#0C2645] pb-5">
                        <h1 class="font-[Cinzel] text-4xl text-[#0C2645]"> PEDIDO </h1>
                        <span class="text-2xl text-[#2C2828]"> N° {{ String(pedido.id).padStart(8, '0') }} </span>
                    </div>
                    <div v-for="item in pedido.itens" :key="`${item.produto.id}-${item.variacao.id}`" class="mb-3 flex min-h-[185px] border border-[#BFC0C0] p-3">
                        <div class="h-[160px] w-[160px] shrink-0 overflow-hidden border border-[#E1E1E1]">
                            <img :src="item.produto.imagem?.url || item.produto.imagem" :alt="`Vela Aromática - ${item.produto.nome}`" class="h-full w-full object-cover" />
                        </div>
                        <div class="ml-4 flex flex-1 flex-col justify-between py-1">
                            <div>
                                <p class="text-base text-[#2C2828]">  Vela Aromática - </p>
                                <p class="text-base text-[#2C2828]"> {{ item.produto.nome }}</p>
                                <p class="mt-1 text-sm text-[#2C2828]"> Tamanho: {{ item.variacao.tamanho }}</p>
                                <p class="text-sm text-[#2C2828]"> Quantidade: {{ item.quantidade }} </p>
                            </div>
                            <p class="text-xl text-[#2C2828]"> Total: R${{ formatPrice(item.total) }} </p>
                        </div>
                        <div class="hidden w-[70px] shrink-0 text-center text-sm text-[#2C2828] md:block">
                            Status
                        </div>
                    </div>
                    <div class="mt-12 border-t border-[#BFC0C0]">
    <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-2 text-base text-[#2C2828]">
        <span>Subtotal:</span>
        <span>R${{ formatPrice(pedido.subtotal) }}</span>
    </div>
    <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-2 text-base text-[#2C2828]">
        <span>Descontos:</span>
        <span>R${{ formatPrice(pedido.desconto) }}</span>
    </div>
    <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-2 text-base text-[#2C2828]">
        <span>Frete:</span>
        <span>R${{ formatPrice(pedido.frete) }}</span>
    </div>
    <div class="flex justify-between px-5 py-2 text-2xl text-[#0C2645]">
        <span>Total</span>
        <span>R${{ formatPrice(pedido.subtotal - pedido.desconto + pedido.frete) }}</span>
    </div>
</div>
                </section>
                <section>
                    <h2 class="mb-9 border-b border-[#0C2645] pb-5 font-[Cinzel] text-4xl text-[#0C2645]">
                        STATUS DO PEDIDO
                    </h2>
                    <div class="relative ml-1">
                        <div class="absolute bottom-[20px] left-[8px] top-[20px] w-[2px] bg-[#BFC0C0]"></div>
                        <div v-for="(step, index) in statusSteps" :key="step.value" class="relative flex min-h-[120px]">
                            <div class="relative z-10 mt-3 h-[16px] w-[16px] shrink-0 rounded-full border-2" :class="isCompleted(index) ? 'border-[#0C2645] bg-[#0C2645]' : 'border-[#BFC0C0] bg-white'"></div>
                            <div class="ml-5 flex h-[65px] w-[65px] shrink-0 items-center justify-center">
                            </div>
                            <div class="ml-4 flex-1">
                                <h3 class="text-xl" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'"> {{ step.title }} </h3>
                                <p class="mt-1 text-sm" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'">{{ step.description }} </p>
                            </div>
                            <span class="shrink-0 pt-1 text-sm" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'"> DD/MM/AAAA
                            </span>
                        </div>
                    </div>
                    <div class="mt-10 flex justify-center gap-5 mx-10">
                        <button type="button" @click="cancelarPedido" class="h-[48px] min-w-[195px] border border-[#0C2645] px-6 text-[#0C2645] transition hover:bg-gray-100"> Cancelar pedido </button>
                        <button type="button" @click="comprarNovamente" class="h-[48px] min-w-[195px] bg-[#0C2645] px-6 text-white transition hover:bg-[#163657]"> Comprar Novamente </button>
                    </div>
                </section>
            </div>
        </section>
    </main>
</template>