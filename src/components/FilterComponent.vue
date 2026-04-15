<script setup>
import { ref } from 'vue'

const mostrarFiltros = ref(false)
const mostrarOrdenar = ref(false)
const mostrarColecao = ref(false)
const ordenacao = ref('')
const colecoesSelecionadas = ref([])

const emit = defineEmits(['aplicar', 'limpar'])

const aplicarFiltros = () => {
    emit('aplicar', {
        ordenacao: ordenacao.value,
        colecoes: colecoesSelecionadas.value
    })
}

const limparFiltros = () => {
    ordenacao.value = ''
    colecoesSelecionadas.value = []

    emit('limpar')
}
</script>

<template>
    <div class="m-6">

        <button @click="mostrarFiltros = !mostrarFiltros" class="border border-[#A9A9A9] w-full p-2 text-[#2C2828]">
            {{ mostrarFiltros ? '- Filtros' : '+ Filtros' }}
        </button>

        <div v-if="mostrarFiltros" class="mt-4 flex flex-col">

            <div class="border border-[#A9A9A9] mb-4">
                <button @click="mostrarOrdenar = !mostrarOrdenar"
                    class="w-full px-4 py-2 text-[#2C2828] flex justify-between items-center">
                    <span>Ordenar</span>
                    <img src="/icons/aba.svg" alt="" :class="{ 'rotate-180': mostrarOrdenar }"
                        class="transition-transform duration-300">
                </button>
                <div v-if="mostrarOrdenar" class="px-4 py-2 grid grid-cols-2">
                    <label><input type="radio" value="maior" v-model="ordenacao"> Maior preço</label>
                    <label><input type="radio" value="alfabetica" v-model="ordenacao"> Ordem alfabética</label>
                    <label><input type="radio" value="menor" v-model="ordenacao"> Menor preço</label>
                    <label><input type="radio" value="decrescente" v-model="ordenacao"> Ordem decrescente</label>
                </div>
            </div>

            <div class="border border-[#A9A9A9] mb-4">
                <button @click="mostrarColecao = !mostrarColecao"
                    class="w-full px-4 py-2 text-[#2C2828] flex justify-between items-center">
                    <span>Coleção</span>
                    <img src="/icons/aba.svg" alt="" :class="{ 'rotate-180': mostrarColecao }"
                        class="transition-transform duration-300">
                </button>
                <div v-if="mostrarColecao" class="px-4 py-2 grid grid-cols-2">
                    <label><input type="checkbox" value="doces" v-model="colecoesSelecionadas"> Aromas Doces</label>
                    <label><input type="checkbox" value="citricos" v-model="colecoesSelecionadas"> Aromas Cítricos</label>
                    <label><input type="checkbox" value="florais" v-model="colecoesSelecionadas"> Aromas Florais</label>
                    <label><input type="checkbox" value="lembrancinhas" v-model="colecoesSelecionadas"> Lembrancinhas</label>
                </div>
            </div>

            <div class="flex gap-4 mt-4">
                <button @click="limparFiltros" class="border border-[#A9A9A9] px-4 py-2 text-[#2C2828] 
                hover:border-[#0C2645] 
                active:bg-[#A9A9A9] active:scale-95
                transition-all duration-300 cursor-pointer">
                    Limpar
                </button>

                <button @click="aplicarFiltros" class="bg-[#0C2645] border border-[#0C2645] text-[#F8F9F9] px-4 py-2 
                hover:bg-[#254368]
                active:border-[#0C2645] active:bg-[#254368] active:scale-95
                transition-all duration-300 cursor-pointer">
                    Aplicar Filtros
                </button>
            </div>
        </div>
    </div>
</template>