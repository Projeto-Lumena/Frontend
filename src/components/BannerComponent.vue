<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    imagens: {
        type: Array,
        default: () => []
    },
    automatico: {
        type: Boolean,
        default: true
    },
    intervalo: {
        type: Number,
        default: 3000
    }
})
const mobile = ref(window.innerWidth < 768)

const atualizarTela = () => {
  mobile.value = window.innerWidth < 768
}

const primeiro = ref(0)
let tempo = null

const proximo = () => {
    primeiro.value = (primeiro.value + 1) % props.imagens.length
}

const anterior = () => {
    primeiro.value =
        (primeiro.value - 1 + props.imagens.length) % props.imagens.length
}

onMounted(() => {
  window.addEventListener('resize', atualizarTela)

  if (props.automatico && props.imagens.length > 1) {
    tempo = setInterval(proximo, props.intervalo)
  }
})

onUnmounted(() => {
  clearInterval(tempo)
  window.removeEventListener('resize', atualizarTela)
})

</script>
<template>
    <div>
        <div v-if="imagens.length" class="relative w-full h-full md:mt-20">
            <img :src="mobile ? imagens[primeiro].mobile : imagens[primeiro].desktop" :alt="`Banner ${primeiro + 1}`" class="w-full h-full object-cover transition-all duration-400"/>

            <button v-if="imagens.length > 1" type="button" @click="anterior" aria-label="Banner anterior" class="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded bg-black/40 text-white">
                ‹
            </button>
            <button v-if="imagens.length > 1" type="button" @click="proximo" aria-label="Próximo banner" class="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded bg-black/40 text-white">
                ›
            </button>

            <div class="absolute bottom-2 w-full flex justify-center gap-2">
                <span v-for="(img, i) in imagens" :key="i" class="w-2 h-2 rounded-full" :class="i === primeiro ? 'bg-white' : 'bg-white/40'" />
            </div>
        </div>
    </div>
</template>
