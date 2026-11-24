
<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import productsApi from '@/api/productsApi'

const router = useRouter()

const busca = ref('')
const buscaAberta = ref(false)

const resultados = ref([])
const pesquisando = ref(false)
const erroBusca = ref('')

watch(busca, (novoTermo, antigoTermo, onCleanup) => {
    const termo = novoTermo.trim()

    resultados.value = []
    erroBusca.value = ''

    if (!termo) {
        pesquisando.value = false
        return
    }

    pesquisando.value = true

    let ativo = true

    const temporizador = setTimeout(async () => {
        try {
            const produtos = await productsApi.getAll({
                search: termo
            })

            if (ativo) {
                resultados.value = produtos
            }
        } catch (err) {
            if (ativo) {
                erroBusca.value = 'Erro ao realizar a pesquisa.'
                console.error(err)
            }
        } finally {
            if (ativo) {
                pesquisando.value = false
            }
        }
    }, 300)

    onCleanup(() => {
        ativo = false
        clearTimeout(temporizador)
    })
})

function selecionarProduto(product) {
    busca.value = ''
    buscaAberta.value = false
    resultados.value = []

    router.push({
        name: 'produto',
        params: {
            id: product.id
        }
    })
}

function abrirBuscaMobile() {
    buscaAberta.value = true
}

function fecharBuscaMobile() {
    buscaAberta.value = false
    busca.value = ''
    resultados.value = []
}
</script>

<template>
    <!-- Pesquisa Desktop -->
    <div class="relative hidden md:block">
        <div class="flex items-center gap-2 border-b border-white/70 px-1 py-1">
            <img src="/icons/buscar.svg" alt="Buscar" class="w-5 md:w-6">

            <input
                v-model="busca"
                type="text"
                placeholder="Buscar produtos..."
                class="w-28 md:w-40 lg:w-52 bg-transparent text-white placeholder-white/70 outline-none text-sm"
            >
        </div>

        <div
            v-if="busca.trim()"
            class="absolute right-0 top-full mt-3 w-72 bg-white border border-[#E7EAE9] shadow-lg z-[100]"
        >
            <p v-if="pesquisando" class="p-4 text-sm text-gray-500 text-center">
                Pesquisando...
            </p>

            <p v-else-if="erroBusca" class="p-4 text-sm text-red-500 text-center">
                {{ erroBusca }}
            </p>

            <template v-else>
                <button
                    v-for="product in resultados"
                    :key="product.id"
                    @click="selecionarProduto(product)"
                    class="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F5F5F5] transition"
                >
                    <img
                        v-if="product.imagem?.url"
                        :src="product.imagem.url"
                        :alt="product.nome"
                        class="w-12 h-12 object-cover"
                    >

                    <div>
                        <p class="text-sm text-[#0C2645] font-semibold">
                            {{ product.nome }}
                        </p>

                        <p class="text-xs text-[#2C2828]">
                            Vela Aromática
                        </p>
                    </div>
                </button>

                <p
                    v-if="resultados.length === 0"
                    class="p-4 text-sm text-gray-500 text-center"
                >
                    Nenhum produto encontrado.
                </p>
            </template>
        </div>
    </div>

    <!-- Pesquisa Mobile -->
    <div class="md:hidden relative h-full w-full">
        <button
            @click="abrirBuscaMobile"
            class="h-full w-full flex flex-col items-center justify-center text-white"
        >
            <img class="w-5 h-5" src="/icons/buscar.svg" alt="Buscar">

            <span class="text-sm font-sen">
                Buscar
            </span>
        </button>

        <div
            v-if="buscaAberta"
            class="fixed bottom-15 left-0 w-full bg-white p-4 shadow-lg z-[100]"
        >
            <div class="flex items-center gap-2 border border-[#E7EAE9] px-3 py-2">
                <img src="/icons/buscar.svg" alt="Buscar" class="w-5 h-5">

                <input
                    v-model="busca"
                    type="text"
                    placeholder="Buscar produtos..."
                    class="w-full outline-none text-sm text-[#2C2828]"
                    autofocus
                >

                <button
                    @click="fecharBuscaMobile"
                    class="text-xl text-[#0C2645]"
                >
                    ×
                </button>
            </div>

            <div
                v-if="busca.trim()"
                class="max-h-60 overflow-y-auto mt-2 border border-[#E7EAE9]"
            >
                <p v-if="pesquisando" class="p-4 text-sm text-gray-500 text-center">
                    Pesquisando...
                </p>

                <p v-else-if="erroBusca" class="p-4 text-sm text-red-500 text-center">
                    {{ erroBusca }}
                </p>

                <template v-else>
                    <button
                        v-for="product in resultados"
                        :key="product.id"
                        @click="selecionarProduto(product)"
                        class="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F5F5F5]"
                    >
                        <img
                            v-if="product.imagem?.url"
                            :src="product.imagem.url"
                            :alt="product.nome"
                            class="w-12 h-12 object-cover"
                        >

                        <div>
                            <p class="text-sm text-[#0C2645] font-semibold">
                                {{ product.nome }}
                            </p>

                            <p class="text-xs text-[#2C2828]">
                                Vela Aromática
                            </p>
                        </div>
                    </button>

                    <p
                        v-if="resultados.length === 0"
                        class="p-4 text-sm text-gray-500 text-center"
                    >
                        Nenhum produto encontrado.
                    </p>
                </template>
            </div>
        </div>
    </div>
</template>
