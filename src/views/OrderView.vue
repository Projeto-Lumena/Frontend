<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBagStore } from '@/stores/bag'
import { useGeolocation } from '@/composables/useGeolocation'
import geocodingApi from '@/api/geocodingApi'
import LocationMap from '@/components/LocationMap.vue'
import { useUserStore } from '@/stores/userInfoStore'
import comprasApi from '@/api/comprasApi'

const userStore = useUserStore()
const router = useRouter()
const bagStore = useBagStore()

const {
    location,
    loadingLocation,
    locationError,
    requestCurrentLocation,
    setLocationLabel
} = useGeolocation()

const metodoPagamento = ref('')
const tipoEntrega = ref('')
const enderecoManual = ref('')
const buscandoEndereco = ref(false)
const fazendoPedido = ref(false)
const distanceKm = ref(null)

const STORE_ADDRESS = 'R. José Gomes de Freitas, 160 - Costa e Silva, Joinville - SC, 89220-780'
const WHATSAPP_VENDEDORA = '554796973888'

const frete = computed(() => {
    if (tipoEntrega.value !== 'Uber Entregas') return 0
    if (distanceKm.value === null) return 0

    return distanceKm.value * 2
})

const totalPedido = computed(() => {
    return Number(bagStore.subtotal || 0) + Number(frete.value || 0)
})

const podeFazerPedido = computed(() => {
    if (!metodoPagamento.value || !tipoEntrega.value) return false
    if (!bagStore.items.length) return false
    if (tipoEntrega.value === 'Uber Entregas' && !location.value) return false

    return true
})

function salvarPedidoLocal(id, resumo) {
    const primeiroItem = resumo.itens[0] || {}

    const dados = {
        ...resumo,
        id,
        status: 'Pedido Realizado',
        nome: primeiroItem.nome || '',
        imagem: primeiroItem.imagem || '',
        tamanho: primeiroItem.tamanho || '',
        quantidade: resumo.itens.reduce(
            (total, item) => total + item.quantidade,
            0
        )
    }

    localStorage.setItem(
        `lumena-pedido-${id}`,
        JSON.stringify(dados)
    )
}

function formatPrice(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function formatDistance(value) {
    return Number(value || 0).toFixed(2).replace('.', ',')
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    )
    return R * c
}

async function calcularFretePorLocalizacao(currentLocation) {
    try {
        const storeCoordinates = await geocodingApi.search(STORE_ADDRESS)

        if (storeCoordinates) {
            distanceKm.value = calcularDistancia(
                currentLocation.latitude,
                currentLocation.longitude,
                Number(storeCoordinates.latitude),
                Number(storeCoordinates.longitude)
            )
        }
    } catch (error) {
        console.error('Erro ao calcular distância:', error)
        distanceKm.value = null
    }
}

async function buscarLocalizacao() {
    const currentLocation = await requestCurrentLocation()

    if (!currentLocation) return

    try {
        const address = await geocodingApi.reverse(
            currentLocation.latitude,
            currentLocation.longitude
        )

        setLocationLabel(address.label)

        await calcularFretePorLocalizacao(currentLocation)

        enderecoManual.value = ''

    } catch (error) {
        console.error('Erro ao obter endereço:', error)
    }
}

async function buscarEnderecoManual() {
    const endereco = enderecoManual.value.trim()

    if (!endereco) return

    buscandoEndereco.value = true

    try {
        const resultado = await geocodingApi.search(endereco)

        if (!resultado) {
            alert(
                'Não foi possível encontrar esse endereço. Confira os dados e tente novamente.'
            )
            return
        }

        const latitude = Number(resultado.latitude)
        const longitude = Number(resultado.longitude)

        const enderecoEncontrado =
            resultado.display_name ||
            resultado.label ||
            endereco

        location.value = {
            latitude,
            longitude,
            label: enderecoEncontrado
        }

        setLocationLabel(enderecoEncontrado)

        await calcularFretePorLocalizacao({
            latitude,
            longitude
        })

    } catch (error) {
        console.error('Erro ao buscar endereço:', error)
        alert('Não foi possível localizar esse endereço.')

    } finally {
        buscandoEndereco.value = false
    }
}

function selecionarEntrega(tipo) {
    tipoEntrega.value = tipo

    if (tipo === 'Vou buscar') {
        distanceKm.value = 0

    } else if (
        tipo === 'Uber Entregas' &&
        location.value?.latitude
    ) {
        calcularFretePorLocalizacao(location.value)
    }
}

function abrirWhatsApp() {
    const entrega = tipoEntrega.value || 'a combinar'
    const endereco =
        location.value?.label ||
        enderecoManual.value ||
        'não informado'
    const pagamento =
        metodoPagamento.value ||
        'a combinar'
  const mensagem = `Olá! Gostaria de combinar meu pedido na Lumena.

Forma de pagamento: ${pagamento}
Entrega: ${entrega}
Endereço: ${endereco}

Gostaria de combinar com você se vou buscar ou se será feita a entrega por Uber.`

    window.open(
        `https://wa.me/${WHATSAPP_VENDEDORA}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
    )
}

function voltar() {
    router.push({ name: 'sacola' })
}

async function fazerPedido() {
    if (!podeFazerPedido.value) return

    fazendoPedido.value = true
    const resumoDoPedido = {
        metodoPagamento: metodoPagamento.value,
        tipoEntrega: tipoEntrega.value,
        endereco: location.value?.label || enderecoManual.value.trim() || '',
        distancia: distanceKm.value,
        frete: frete.value,
        subtotal: bagStore.subtotal,
        total: totalPedido.value,
        data: new Date().toLocaleDateString('pt-BR'),
        itens: bagStore.items.map(item => ({
            nome: item.nome,
            tamanho: item.tamanho,
            preco: item.preco,
            quantidade: item.quantidade,
            imagem: item.imagem
        }))
    }

    try {
        const response = await comprasApi.create({
            itens: bagStore.items.map(item => ({
                produto: item.produtoId,
                variacao: item.id,
                quantidade: item.quantidade
            }))
        })

        const compraSalva = response.data
        salvarPedidoLocal(compraSalva.id, resumoDoPedido)
        await userStore.carregarPedidos()
        bagStore.clearBag()

        router.push({
            name: 'pedido',
            params: {
                id: compraSalva.id
            }
        })

    } catch (error) {
        console.error('Erro ao fazer pedido:', error)

        if (error.response) {
            console.error(
                'Resposta do backend:',
                error.response.data
            )

            alert(
                'Não foi possível finalizar o pedido. Verifique os dados e tente novamente.'
            )
        } else {
            alert(
                'Não foi possível conectar ao servidor.'
            )
        }

    } finally {
        fazendoPedido.value = false
    }
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
                <h1 class="text-center font-[Cinzel] text-3xl text-[#0C2645] md:text-4xl lg:text-4xl"> FAZER PEDIDO  </h1>
            </div>
            <div class="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_400px] lg:gap-[100px]">
                <section>
                    <div class="mb-10">
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]"> PRODUTOS </h2>
                        <div v-for="item in bagStore.items" :key="item.id" class="mb-3 flex min-h-[150px] border border-[#BFC0C0] p-3">
                            <div class="h-[125px] w-[125px] shrink-0 overflow-hidden border border-[#E1E1E1]">
                                <img :src="item.imagem" :alt="item.nome" class="h-full w-full object-cover">
                            </div>
                            <div class="ml-5 flex flex-1 flex-col justify-between py-1">
                                <div>
                                    <p class="text-base text-[#2C2828]">     Vela Aromática - </p>
                                    <p class="text-base text-[#2C2828]">  {{ item.nome }}  </p>
                                    <p class="mt-2 text-sm text-[#2C2828]"> Tamanho: {{ item.tamanho }}  </p>
                                    <p class="text-sm text-[#2C2828]">  Quantidade: {{ item.quantidade }}  </p>
                                </div>
                                <p class="text-lg text-[#2C2828]">  R${{ formatPrice(item.preco * item.quantidade) }} </p>
                            </div>
                        </div>
                    </div>
                    <div class="mb-10">
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">  FORMA DE PAGAMENTO </h2>
                        <div class="flex flex-col">
                            <label class="flex h-[55px] cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]" :class="metodoPagamento === 'Pix' ? 'border-[#0C2645] bg-gray-50' : ''">
                                <input v-model="metodoPagamento" type="radio" value="Pix" class="sr-only">
                                <img src="/icons/pix.svg" alt="Pix" class="mr-4 h-7 w-7 object-contain">
                                <span class="text-[#2C2828]">  Pix </span>
                            </label>
                            <label class="-mt-px flex h-[55px] cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]" :class="metodoPagamento === 'Dinheiro' ? 'border-[#0C2645] bg-gray-50' : ''">
                                <input v-model="metodoPagamento" type="radio" value="Dinheiro" class="sr-only">
                                <img src="/icons/dinheiro.svg" alt="Dinheiro" class="mr-4 h-7 w-7 object-contain">
                                <span class="text-[#2C2828]">  Dinheiro (combinar com a vendedora)  </span>
                            </label>
                        </div>
                    </div>
                    <div class="mb-10">
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">  ENTREGA </h2>
                        <div class="mb-5 flex flex-col border border-[#BFC0C0]">
                            <button type="button" @click="selecionarEntrega('Vou buscar')" class="flex min-h-[58px] items-center justify-between border-b border-[#BFC0C0] px-5 text-left transition" :class="tipoEntrega === 'Vou buscar' ? 'bg-gray-50 text-[#0C2645]' : 'text-[#2C2828]'">
                                <span>Vou buscar o pedido</span>
                                <span class="text-xl">›</span>
                            </button>
                            <button type="button" @click="selecionarEntrega('Uber Entregas')" class="flex min-h-[58px] items-center justify-between px-5 text-left transition" :class="tipoEntrega === 'Uber Entregas' ? 'bg-gray-50 text-[#0C2645]' : 'text-[#2C2828]'">
                                <span>Uber Entregas</span>
                                <span class="text-xl">›</span>
                            </button>
                        </div>
                        <div class="border border-[#BFC0C0] p-5">
                            <div class="mb-5">
                                <p class="mb-3 text-sm text-[#777]">  Endereço para entrega </p>
                                <div class="flex gap-2">
                                    <input v-model="enderecoManual" type="text" placeholder="Digite seu endereço" class="min-w-0 flex-1 border border-[#BFC0C0] px-4 py-3 text-sm text-[#2C2828] outline-none focus:border-[#0C2645]" @keyup.enter="buscarEnderecoManual">
                                    <button type="button" @click="buscarEnderecoManual" :disabled="buscandoEndereco || !enderecoManual.trim()" class="border border-[#0C2645] px-4 text-sm text-[#0C2645] disabled:cursor-not-allowed disabled:opacity-50">
                                        {{ buscandoEndereco ? 'Buscando...' : 'Buscar' }}
                                    </button>
                                </div>
                                <button type="button" @click="buscarLocalizacao" :disabled="loadingLocation" class="mt-3 text-sm text-[#0C2645] underline"> {{ loadingLocation ? 'Obtendo localização...' : 'Usar minha localização atual' }} </button>
                            </div>
                            <div class="mb-5">
                                <p class="mb-1 text-sm text-[#777]">  Endereço selecionado  </p>
                                <p v-if="location?.label" class="text-sm text-[#2C2828]">  {{ location.label }} </p>
                                <p v-else-if="locationError" class="text-sm text-red-600"> {{ locationError }} </p>
                                <p v-else class="text-sm text-[#777]">  Nenhum endereço selecionado. </p>
                            </div>
                            <LocationMap v-if="location" :location="location" />
                            <div v-if="distanceKm !== null && tipoEntrega === 'Uber Entregas'" class="mt-5 border-t border-[#BFC0C0] pt-4">
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
                                <p class="mb-3 text-sm text-[#2C2828]">  Combine os detalhes da entrega diretamente com a vendedora. </p>
                                <button type="button" @click="abrirWhatsApp" class="flex w-full items-center justify-center gap-2 bg-[#0C2645] px-5 py-3 text-sm text-white transition hover:bg-[#163657]"> Combinar entrega pelo WhatsApp </button>
                            </div>
                        </div>
                    </div>
                </section>
                <aside>
                    <div class="border border-[#BFC0C0]">
                        <div class="border-b border-[#BFC0C0] px-5 py-4">
                            <h2 class="font-[Cinzel] text-2xl text-[#0C2645]">  RESUMO  </h2>
                        </div>
                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                            <span>Subtotal:</span>
                            <span>R${{ formatPrice(bagStore.subtotal) }}</span>
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
                        <button type="button" @click="voltar" class="h-[40px] flex-1 border border-[#0C2645] text-[#0C2645] transition hover:bg-gray-100"> Voltar</button>
                        <button type="button" @click="fazerPedido" :disabled="fazendoPedido || !podeFazerPedido" class="h-[40px] flex-1 bg-[#0C2645] text-white transition hover:bg-[#163657] disabled:cursor-not-allowed disabled:opacity-50">  {{ fazendoPedido ? 'Enviando...' : 'Fazer Pedido' }} </button>
                    </div>
                </aside>
            </div>
        </section>
    </main>
</template>
