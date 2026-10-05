<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBagStore } from '@/stores/bag'
import comprasApi from '@/api/comprasApi'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const bagStore = useBagStore()

const pedido = ref(null)
const loading = ref(true)
const error = ref('')
const mostrarConfirmacao = ref(false)
const mostrarSucesso = ref(false)

const WHATSAPP_VENDEDORA = '554796973888'

const statuspassos = [
    {
        value: 'Pedido Realizado',
        title: 'Pedido Realizado',
        description: 'Pedido realizado, aguardando pagamento.',
        icon: '/icons/pedido.svg'
    },
    {
        value: 'Pago',
        title: 'Pagamento Realizado',
        description: 'Pedido pago, aguardando entrega.',
        icon: '/icons/pagamento.svg'
    },
    {
        value: 'Entregue',
        title: 'Entregue',
        description: 'Pedido entregue.',
        icon: '/icons/entregue.svg'
    }
]

const currentStatusIndex = computed(() => {
    if (!pedido.value?.status) return -1
    return statuspassos.findIndex(passo => passo.value === pedido.value.status)
})

const pedidoCancelado = computed(() => pedido.value?.status === 'Cancelado')

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

function totalPedido() {
    return Number(pedido.value?.subtotal || 0) + Number(pedido.value?.frete || 0)
}

async function carregarPedido() {
    try {
        error.value = ''
        loading.value = true

        const id = route.params.id
        const response = await comprasApi.getById(id)
        const pedidoApi = response.data

        let dadosLocais = {}

        const pedidoSalvo = localStorage.getItem(`lumena-pedido-${id}`)

        if (pedidoSalvo) {
            try {
                dadosLocais = JSON.parse(pedidoSalvo)
            } catch (err) {
                console.error('Erro ao ler dados locais do pedido:', err)
            }
        }

        const subtotal = pedidoApi.itens?.reduce((total, item) => {
            return total + Number(item.total || 0)
        }, 0) || 0

        pedido.value = {
            ...pedidoApi,
            status: dadosLocais.status || (pedidoApi.status === 'Finalizado' ? 'Pedido Realizado' : pedidoApi.status),
            data: dadosLocais.data || '',
            subtotal: dadosLocais.subtotal ?? subtotal,
            frete: dadosLocais.frete ?? 0,
            metodoPagamento: dadosLocais.metodoPagamento || '',
            tipoEntrega: dadosLocais.tipoEntrega || '',
            endereco: dadosLocais.endereco || '',
            distancia: dadosLocais.distancia ?? null
        }
    } catch (err) {
        console.error('Erro ao carregar pedido:', err)

        const id = route.params.id
        const pedidoSalvo = localStorage.getItem(`lumena-pedido-${id}`)

        if (pedidoSalvo) {
            try {
                pedido.value = JSON.parse(pedidoSalvo)
            } catch {
                error.value = 'Não foi possível carregar o pedido.'
            }
        } else {
            error.value = 'Pedido não encontrado.'
        }
    } finally {
        loading.value = false
    }
}

function abrirWhatsApp(mensagem) {
    window.open(`https://wa.me/${WHATSAPP_VENDEDORA}?text=${encodeURIComponent(mensagem)}`, '_blank')
}

function combinarEntrega() {
    if (!pedido.value || pedidoCancelado.value) return

    const mensagem = `Olá! Gostaria de combinar a entrega do meu pedido na Lumena.

Pedido: N° ${String(pedido.value.id).padStart(8, '0')}
Valor: R$${formatPrice(totalPedido())}
Forma de pagamento: ${pedido.value.metodoPagamento || 'A combinar'}
Tipo de entrega: ${pedido.value.tipoEntrega || 'A combinar'}
Endereço: ${pedido.value.endereco || 'A combinar'}

Gostaria de combinar com você como será a entrega.`

    abrirWhatsApp(mensagem)
}

function efetuarPagamento() {
    if (!pedido.value || pedidoCancelado.value) return

    const mensagem = `Olá! Gostaria de efetuar o pagamento do meu pedido na Lumena.

Pedido: N° ${String(pedido.value.id).padStart(8, '0')}
Valor: R$${formatPrice(totalPedido())}
Forma de pagamento: ${pedido.value.metodoPagamento || 'A combinar'}

Gostaria de receber as informações para realizar o pagamento.`

    abrirWhatsApp(mensagem)
}

function abrirConfirmacao() {
    if (pedidoCancelado.value) return
    mostrarConfirmacao.value = true
}

function fecharConfirmacao() {
    mostrarConfirmacao.value = false
}

function cancelarPedido() {
    if (!pedido.value) return

    pedido.value.status = 'Cancelado'
    pedido.value.cancelado = true

    localStorage.setItem(`lumena-pedido-${pedido.value.id}`, JSON.stringify(pedido.value))

    if (authStore.userEmail) {
        const pedidosKey = `lumena-pedidos-${authStore.userEmail}`
        const pedidosSalvos = localStorage.getItem(pedidosKey)

        if (pedidosSalvos) {
            try {
                const pedidos = JSON.parse(pedidosSalvos)

                const pedidosAtualizados = pedidos.map(item =>
                    item.id === pedido.value.id
                        ? { ...item, status: 'Cancelado', cancelado: true }
                        : item
                )

                localStorage.setItem(pedidosKey, JSON.stringify(pedidosAtualizados))
            } catch (err) {
                console.error('Erro ao atualizar pedido no perfil:', err)
            }
        }
    }

    mostrarConfirmacao.value = false
    mostrarSucesso.value = true

    setTimeout(() => {
        router.push({ name: 'perfil' })
    }, 1800)
}

function comprarNovamente() {
    if (!pedido.value?.itens?.length) {
        router.push('/')
        return
    }

    pedido.value.itens.forEach((item) => {
        const produto = item.produto
        const variacao = item.variacao

        if (!produto || !variacao) return

        bagStore.addToBag(
            {
                id: variacao.id,
                produtoId: produto.id,
                nome: produto.nome,
                tamanho: variacao.tamanho,
                preco: Number(variacao.preco),
                imagem: produto.imagem?.url || ''
            },
            Number(item.quantidade) || 1
        )
    })

    router.push({ name: 'sacola' })
}

function voltarInicio() {
    router.push('/')
}

onMounted(carregarPedido)
</script>

<template>
    <main v-if="loading" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <div class="flex min-h-[500px] items-center justify-center text-[#0C2645]">Carregando pedido...</div>
    </main>
    <main v-else-if="error" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <div class="mx-auto max-w-[700px] py-20 text-center">
            <p class="mb-6 text-[#2C2828]">{{ error }}</p>
            <button type="button" @click="carregarPedido" class="border border-[#0C2645] px-8 py-3 text-[#0C2645]">Tentar novamente</button>
        </div>
    </main>
    <main v-else-if="pedido" class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <section class="mx-auto max-w-[1250px]">
            <div class="grid grid-cols-1 gap-16 lg:grid-cols-[450px_1fr] lg:gap-[130px]">
                <section>
                    <div class="mb-9 flex items-center gap-8 border-b border-[#0C2645] pb-5">
                        <h1 class="text-center font-[Cinzel] text-3xl text-[#0C2645] md:text-4xl">PEDIDO</h1>
                        <span class="text-2xl text-[#2C2828]">N° {{ String(pedido.id).padStart(8, '0') }}</span>
                    </div>
                    <div v-for="item in pedido.itens" :key="`${item.produto.id}-${item.variacao.id}`" class="mb-3 flex min-h-[185px] border border-[#BFC0C0] p-3">
                        <div class="h-[160px] w-[160px] shrink-0 overflow-hidden border border-[#E1E1E1]">
                            <img :src="item.produto.imagem?.url || item.produto.imagem" :alt="`Vela Aromática - ${item.produto.nome}`" class="h-full w-full object-cover">
                        </div>
                        <div class="ml-4 flex flex-1 flex-col justify-between py-1">
                            <div>
                                <p class="text-base text-[#2C2828]">Vela Aromática -</p>
                                <p class="text-base text-[#2C2828]">{{ item.produto.nome }}</p>
                                <p class="mt-1 text-sm text-[#2C2828]">Tamanho: {{ item.variacao.tamanho }}</p>
                                <p class="text-sm text-[#2C2828]">Quantidade: {{ item.quantidade }}</p>
                            </div>
                            <p class="text-xl text-[#2C2828]">Total: R${{ formatPrice(item.total) }}</p>
                        </div>
                        <div class="hidden w-[70px] shrink-0 text-center text-sm text-[#2C2828] md:block">Status</div>
                    </div>
                    <div class="mt-12 border-t border-[#BFC0C0]">
                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-2 text-base text-[#2C2828]">
                            <span>Subtotal:</span>
                            <span>R${{ formatPrice(pedido.subtotal) }}</span>
                        </div>
                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-2 text-base text-[#2C2828]">
                            <span>Frete:</span>
                            <span>R${{ formatPrice(pedido.frete) }}</span>
                        </div>
                        <div class="flex justify-between px-5 py-2 text-2xl text-[#0C2645]">
                            <span>Total</span>
                            <span>R${{ formatPrice(totalPedido()) }}</span>
                        </div>
                    </div>
                    <div v-if="!pedidoCancelado" class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button type="button" @click="combinarEntrega" class="h-[48px] border border-[#0C2645] px-6 text-[#0C2645] transition hover:bg-gray-100">Combinar entrega</button>
                        <button type="button" @click="efetuarPagamento" class="h-[48px] bg-[#0C2645] px-6 text-white transition hover:bg-[#163657]">Efetuar pagamento</button>
                    </div>
                </section>
                <section>
                    <h2 class="mb-9 border-b border-[#0C2645] pb-5 font-[Cinzel] text-4xl text-[#0C2645]">STATUS DO PEDIDO</h2>
                    <div class="relative ml-1">
                        <div class="absolute bottom-[45px] left-[32px] top-[45px] w-[2px] bg-[#BFC0C0]"></div>
                        <div v-for="(passo, index) in statuspassos" :key="passo.value" class="relative flex min-h-[135px]">
                            <div class="relative z-10 flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-full border bg-white" :class="isCompleted(index) ? 'border-[#0C2645]' : 'border-[#BFC0C0]'">
                                <div class="h-[35px] w-[35px]" :class="isCompleted(index) ? 'bg-[#0C2645]' : 'bg-[#BFC0C0]'" :style="{ mask: `url(${passo.icon}) center / contain no-repeat`, '-webkit-mask': `url(${passo.icon}) center / contain no-repeat` }"></div>
                            </div>
                            <div class="ml-5 flex flex-1 flex-col justify-center">
                                <h3 class="text-xl" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'">{{ passo.title }}</h3>
                                <p class="mt-1 text-sm" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'">{{ passo.description }}</p>
                            </div>
                            <span class="shrink-0 pt-1 text-sm" :class="isCompleted(index) ? 'text-[#2C2828]' : 'text-[#B0B0B0]'">{{ isCompleted(index) ? pedido.data : 'DD/MM/AAAA' }}</span>
                        </div>
                    </div>
                    <div v-if="pedidoCancelado" class="mt-2 border border-[#BFC0C0] px-5 py-4 text-center text-[#2C2828]">
                        <p class="text-lg">Pedido cancelado</p>
                        <p class="mt-1 text-sm">Este pedido não poderá mais ser alterado.</p>
                    </div>
                    <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button v-if="!pedidoCancelado" type="button" @click="abrirConfirmacao" class="h-[48px] border border-[#0C2645] px-6 text-[#0C2645] transition hover:bg-gray-100">Cancelar pedido</button>
                        <button type="button" @click="comprarNovamente" class="h-[48px] bg-[#0C2645] px-6 text-white transition hover:bg-[#163657]">Comprar novamente</button>
                    </div>
                    <button type="button" @click="voltarInicio" class="mt-5 w-full text-center text-sm text-[#0C2645] underline transition hover:text-[#163657]">Voltar ao início</button>
                </section>
            </div>
        </section>
    </main>
    <div v-if="mostrarConfirmacao" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5">
        <div class="w-full max-w-[450px] border border-[#BFC0C0] bg-white p-8 text-center shadow-lg">
            <h2 class="font-[Cinzel] text-2xl text-[#0C2645]">Cancelar pedido?</h2>
            <p class="mt-5 text-base leading-6 text-[#2C2828]">Tem certeza de que deseja cancelar este pedido? Essa ação não poderá ser desfeita.</p>
            <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" @click="fecharConfirmacao" class="h-[48px] border border-[#0C2645] px-5 text-[#0C2645] transition hover:bg-gray-100">Não, voltar</button>
                <button type="button" @click="cancelarPedido" class="h-[48px] bg-[#0C2645] px-5 text-white transition hover:bg-[#163657]">Sim, cancelar pedido</button>
            </div>
        </div>
    </div>
    <div v-if="mostrarSucesso" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-5">
        <div class="w-full max-w-[400px] border border-[#BFC0C0] bg-white p-8 text-center shadow-lg">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0C2645] text-2xl text-[#0C2645]">✓</div>
            <h2 class="mt-5 font-[Cinzel] text-2xl text-[#0C2645]">Pedido cancelado</h2>
            <p class="mt-3 text-[#2C2828]">O pedido foi cancelado com sucesso.</p>
        </div>
    </div>
</template>
