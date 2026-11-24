<script setup>
import { computed, ref } from 'vue'
import { useBagStore } from '@/stores/bag.js'

const bagStore = useBagStore()
const items = computed(() => bagStore.items)

const remove = ref(false)
const itemToRemove = ref(null)
const removeMessage = ref(false)
const bagError = ref('')
const processing = ref(false)

function formatPrice(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

async function removerItem(item) {
    if (processing.value) return

    bagError.value = ''

    if (item.quantidade === 1) {
        itemToRemove.value = item
        remove.value = true
    } else {
        processing.value = true

        try {
            await bagStore.decreaseQuantity(item.id)
        } catch (error) {
            bagError.value = 'Não foi possível atualizar a quantidade.'
            console.error(error)
        } finally {
            processing.value = false
        }
    }
}

async function confirmarRemocao() {
    if (!itemToRemove.value || processing.value) return

    processing.value = true
    bagError.value = ''

    try {
        await bagStore.removeFromBag(itemToRemove.value.id)

        remove.value = false
        itemToRemove.value = null
        removeMessage.value = true

        setTimeout(() => {
            removeMessage.value = false
        }, 4000)
    } catch (error) {
        bagError.value = 'Não foi possível remover o item da sacola.'
        console.error(error)
    } finally {
        processing.value = false
    }
}

function cancelarRemocao() {
    if (processing.value) return

    remove.value = false
    itemToRemove.value = null
}

async function aumentarQuantidade(id) {
    if (processing.value) return

    processing.value = true
    bagError.value = ''

    try {
        await bagStore.increaseQuantity(id)
    } catch (error) {
        bagError.value = 'Não foi possível aumentar a quantidade.'
        console.error(error)
    } finally {
        processing.value = false
    }
}
</script>
<template>

    <Transition name="fade">
        <div v-if="remove" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5">
            <div class="w-full max-w-[400px] bg-white p-6 text-center shadow-xl">
                <h2 class="text-xl text-[#0C2645] font-[Cinzel] mb-4"> Remover item </h2>
                <p class="text-[#2C2828] text-sm mb-6"> Você deseja remover esse item da sacola?</p>
                <div class="flex gap-3">
                    <button type="button" @click="cancelarRemocao" :disabled="processing"
                        class="flex-1 border border-[#0C2645] py-2 text-[#0C2645] hover:bg-gray-100 transition">
                        Cancelar
                    </button>
                    <button type="button" @click="confirmarRemocao" :disabled="processing"
                        class="flex-1 bg-[#0C2645] py-2 text-white hover:bg-[#163657] transition disabled:opacity-60">
                        {{ processing ? 'Removendo...' : 'Remover' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="fade">
        <div v-if="removeMessage"
            class="top-5 md:bottom-auto md:top-30 left-1/2 -translate-x-1/2 fixed z-[110] flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-green-700 shadow-lg">
            <span class="text-lg">✓</span>
            <span> Item removido da sacola! </span>
        </div>
    </Transition>
    <h1
        class="text-4xl text-center text-[#0C2645] font-[Cinzel] md:text-4xl lg:text-5xl mt-10 mb-10 lg:text-left lg:max-w-[1250px] lg:mt-40 lg:mx-auto">
        Sacola
    </h1>
    <p v-if="bagError" class="text-center text-red-600 mb-4">
        {{ bagError }}
    </p>
    <section
        class="mx-auto w-[calc(100%-54px)] max-w-[900px] pb-4 mb-4 lg:pb-0 lg:mb-20 lg:max-w-[1250px] lg:grid lg:grid-cols-[1fr_375px] lg:gap-12 lg:items-start">
        <div class="lg:grid lg:grid-cols-2 lg:gap-x-5 lg:gap-y-5">
            <div v-for="item in items" :key="item.id"
                class="flex border border-[#BFC0C0] mb-3 p-2 h-[140px] items-center lg:mb-0 lg:h-[155px]">
                <RouterLink :to="{ name: 'produto', params: { id: item.produtoId || item.id } }"
                    class="w-[118px] h-[120px] shrink-0 lg:w-[132px] lg:h-[135px]">
                    <img :src="item.imagem" :alt="`Vela Aromática - ${item.nome}`" class="w-full h-full object-cover" />
                </RouterLink>
                <div class="flex flex-col justify-between h-full ml-3 flex-1 py-1">
                    <RouterLink :to="{ name: 'produto', params: { id: item.produtoId || item.id } }">
                        <p class="text-[14px] leading-[17px] text-[#2C2828]"> Vela Aromática - </p>
                        <p class="text-[14px] leading-[17px] text-[#2C2828]"> {{ item.nome }} </p>
                        <p class="text-[13px] text-[#2C2828]"> Tamanho: {{ item.tamanho }} </p>
                    </RouterLink>
                    <p class="text-[21px] text-[#2C2828]"> R${{ formatPrice(item.preco) }} </p>
                </div>
                <div
                    class="flex items-center justify-between border border-[#BFC0C0] w-[81px] h-[38px] mt-20 px-2 lg:mt-[95px]">
                    <button type="button" class="text-xl font-light" @click="removerItem(item)" :disabled="processing">
                        −
                    </button>

                    <span class="text-sm">
                        {{ item.quantidade }}
                    </span>

                    <button type="button" class="text-xl font-light" @click="aumentarQuantidade(item.id)"
                        :disabled="processing">
                        +
                    </button>
                </div>
            </div>
            <p v-if="bagStore.loading" class="text-center text-[#2C2828] py-10 lg:col-span-2">
                Carregando sua sacola...
            </p>

            <div v-else-if="items.length === 0" class="text-center text-[#2C2828] py-10 lg:col-span-2">
                Sua sacola está vazia.
            </div>
        </div>
        <div
            class="relative z-10 bg-[#0C2645] w-full mt-6 mb-6 lg:sticky lg:top-auto lg:bottom-8 lg:self-end lg:mt-0 lg:mb-0 lg:w-full lg:bg-transparent">
            <div class="border-t border-[#BFC0C0] bg-white">
                <div class="flex justify-between px-4 py-2 text-sm lg:px-5 lg:py-3">
                    <span>Subtotal:</span>
                    <span> R${{ formatPrice(bagStore.subtotal) }} </span>
                </div>
                <div class="flex justify-between border-t border-[#BFC0C0] px-4 py-2 text-sm lg:px-5 lg:py-3">
                    <span>Descontos</span>
                    <span> R${{ formatPrice(bagStore.descontos) }}</span>
                </div>
            </div>
            <RouterLink v-if="items.length > 0 && !bagStore.loading" to="/fazer-pedido" class="w-full">
                <button type="button"
                    class="w-full h-15 bg-[#0C2645] text-white text-lg flex items-center justify-between px-4 hover:bg-[#163657] transition lg:h-[52px] lg:px-5">
                    <span>Finalizar pedido</span>
                    <span> R${{ formatPrice(bagStore.total) }} </span>
                </button>
            </RouterLink>
        </div>
    </section>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>