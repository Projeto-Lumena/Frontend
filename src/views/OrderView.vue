<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBagStore } from '@/stores/bag'
import { useGeolocation } from '@/composables/useGeolocation'
import geocodingApi from '@/api/geocodingApi'
import LocationMap from '@/components/LocationMap.vue'
import { useUserStore } from '@/stores/userInfoStore'

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
const fazendoPedido = ref(false)
const distanceKm = ref(null)

const STORE_ADDRESS = 'R. José Gomes de Freitas, 160 - Costa e Silva, Joinville - SC, 89220-780'

const frete = computed(() => {
    if (distanceKm.value === null) return 0
    return distanceKm.value * 2
})

const totalPedido = computed(() => {
    return bagStore.subtotal - bagStore.descontos + frete.value
})

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

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
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
        console.error('Erro ao obter endereço ou distância:', error)
    }
}

function voltar() {
    router.push({ name: 'sacola' })
}

async function fazerPedido() {
    if (
        !metodoPagamento.value ||
        !location.value ||
        distanceKm.value === null
    ) {
        return
    }

    fazendoPedido.value = true

    try {
        const pedido = {
            id: Date.now(),
            status: 'Pedido Realizado',
            data: new Date().toLocaleDateString('pt-BR'),

            nome: bagStore.items[0]?.nome || 'Pedido',
            imagem: bagStore.items[0]?.imagem || '',
            tamanho: bagStore.items[0]?.tamanho || '',
            quantidade: bagStore.items.reduce(
                (total, item) => total + item.quantidade,
                0
            ),

            total: `R$${formatPrice(totalPedido.value)}`,

            itens: bagStore.items.map(item => ({
                produto: {
                    id: item.produtoId,
                    nome: item.nome,
                    imagem: item.imagem
                },
                variacao: {
                    id: item.id,
                    tamanho: item.tamanho,
                    preco: item.preco
                },
                quantidade: item.quantidade,
                total: item.preco * item.quantidade
            })),

            subtotal: bagStore.subtotal,
            desconto: bagStore.descontos,
            frete: frete.value,
            metodoPagamento: metodoPagamento.value,
            endereco: location.value.label,
            distancia: distanceKm.value
        }

        userStore.adicionarPedido(pedido)

        localStorage.setItem(
            `lumena-pedido-${pedido.id}`,
            JSON.stringify(pedido)
        )

        bagStore.clearBag()

        router.push({
            name: 'pedido',
            params: { id: pedido.id }
        })

    } catch (error) {
        console.error('Erro ao fazer pedido:', error)
    } finally {
        fazendoPedido.value = false
    }
}

onMounted(async () => {
    if (!bagStore.items.length) {
        router.push({ name: 'sacola' })
        return
    }

    await buscarLocalizacao()
})
</script>

<template>
    <main class="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 md:pt-[175px]">
        <section class="mx-auto max-w-[1250px]">
            <div class="mb-10 border-b border-[#0C2645] pb-5">
                <h1 class="font-[Cinzel] text-4xl text-[#0C2645]">
                    FAZER PEDIDO
                </h1>
            </div>
            <div class="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_400px] lg:gap-[100px]">
                <section>
                    <div class="mb-10">
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
                            PRODUTOS
                        </h2>
                        <div v-for="item in bagStore.items" :key="item.id" class="mb-3 flex min-h-[150px] border border-[#BFC0C0] p-3">
                            <div class="h-[125px] w-[125px] shrink-0 overflow-hidden border border-[#E1E1E1]">
                                <img :src="item.imagem" :alt="item.nome" class="h-full w-full object-cover" />
                            </div>
                            <div class="ml-5 flex flex-1 flex-col justify-between py-1">
                                <div>
                                    <p class="text-base text-[#2C2828]">
                                        Vela Aromática -
                                    </p>
                                    <p class="text-base text-[#2C2828]">
                                        {{ item.nome }}
                                    </p>
                                    <p class="mt-2 text-sm text-[#2C2828]">
                                        Tamanho: {{ item.tamanho }}
                                    </p>
                                    <p class="text-sm text-[#2C2828]">
                                        Quantidade: {{ item.quantidade }}
                                    </p>
                                </div>
                                <p class="text-lg text-[#2C2828]">
                                    R${{ formatPrice(item.preco * item.quantidade) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mb-10">
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
                            FORMA DE PAGAMENTO
                        </h2>
                        <div class="flex flex-col gap-3 sm:flex-row">
                            <label class="flex h-[55px] flex-1 cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]" :class="metodoPagamento === 'Pix' ? 'border-[#0C2645] bg-gray-50' : ''">
                                <input v-model="metodoPagamento" type="radio" value="Pix" class="mr-3 accent-[#0C2645]" />
                                <span class="text-[#2C2828]">
                                    Pix
                                </span>
                            </label>
                            <label class="flex h-[55px] flex-1 cursor-pointer items-center border border-[#BFC0C0] px-5 transition hover:border-[#0C2645]" :class="metodoPagamento === 'Dinheiro' ? 'border-[#0C2645] bg-gray-50' : ''">
                                <input v-model="metodoPagamento" type="radio" value="Dinheiro" class="mr-3 accent-[#0C2645]" />
                                <span class="text-[#2C2828]">
                                    Dinheiro
                                </span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h2 class="mb-6 font-[Cinzel] text-2xl text-[#0C2645]">
                            ENTREGA
                        </h2>
                        <div class="border border-[#BFC0C0] p-5">
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <p class="mb-1 text-sm text-[#777]">
                                        Seu endereço
                                    </p>
                                    <p v-if="loadingLocation" class="text-[#2C2828]">
                                        Obtendo sua localização...
                                    </p>
                                    <p v-else-if="location?.label" class="text-[#2C2828]">
                                        {{ location.label }}
                                    </p>
                                    <p v-else-if="locationError" class="text-red-600">
                                        {{ locationError }}
                                    </p>
                                    <p v-else class="text-[#777]">
                                        Localização não encontrada.
                                    </p>
                                </div>
                                <button type="button" @click="buscarLocalizacao" :disabled="loadingLocation" class="shrink-0 border border-[#0C2645] px-4 py-2 text-sm text-[#0C2645] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
                                    {{ loadingLocation ? 'Localizando...' : 'Atualizar' }}
                                </button>
                            </div>
                            <LocationMap v-if="location" :location="location" />
                            <div v-if="distanceKm !== null" class="mt-5 border-t border-[#BFC0C0] pt-4">
                                <div class="flex justify-between text-[#2C2828]">
                                    <span>
                                        Distância:
                                    </span>
                                    <span>
                                        {{ formatDistance(distanceKm) }} km
                                    </span>
                                </div>
                                <div class="mt-2 flex justify-between text-[#2C2828]">
                                    <span>
                                        Frete:
                                    </span>
                                    <span>
                                        R${{ formatPrice(frete) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <aside>
                    <div class="border border-[#BFC0C0]">
                        <div class="border-b border-[#BFC0C0] px-5 py-4">
                            <h2 class="font-[Cinzel] text-2xl text-[#0C2645]">
                                RESUMO
                            </h2>
                        </div>

                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                            <span>
                                Subtotal:
                            </span>

                            <span>
                                R${{ formatPrice(bagStore.subtotal) }}
                            </span>
                        </div>

                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                            <span>
                                Descontos:
                            </span>
                            <span>
                                R${{ formatPrice(bagStore.descontos) }}
                            </span>
                        </div>
                        <div class="flex justify-between border-b border-[#BFC0C0] px-5 py-3 text-[#2C2828]">
                            <span>
                                Frete:
                            </span>
                            <span>
                                R${{ formatPrice(frete) }}
                            </span>
                        </div>
                        <div class="flex justify-between px-5 py-4 text-2xl text-[#0C2645]">
                            <span>
                                Total
                            </span>
                            <span>
                                R${{ formatPrice(totalPedido) }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-8 flex gap-4">
                        <button type="button" @click="voltar" class="h-[40px] flex-1 border border-[#0C2645] text-[#0C2645] transition hover:bg-gray-100">
                            Voltar
                        </button>
                        <button type="button" @click="fazerPedido" :disabled="fazendoPedido || !metodoPagamento || !location || distanceKm === null" class="h-[40px] flex-1 bg-[#0C2645] text-white transition hover:bg-[#163657] disabled:cursor-not-allowed disabled:opacity-50">
                            {{ fazendoPedido ? 'Enviando...' : 'Fazer Pedido' }}
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    </main>
</template>