<script setup>
import { useAromasStore } from '@/stores/useAromasStore'

const aromasStore = useAromasStore()
const aromas = aromasStore.aromas
</script>
<template>
    <main class="bg-white min-h-screen pb-20">
        <section class="pt-10 pb-10 lg:pt-20 lg:pb-16">
            <h1 class="lg:mt-20 text-4xl text-center text-[#0C2645] font-[Cinzel] md:text-5xl lg:text-6xl"> Aromas </h1>
        </section>
        <section class="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div v-for="(aroma, index) in aromas" :key="aroma.nome" class="grid lg:grid-cols-2  gap-8 lg:gap-16 items-center mb-16 lg:mb-28">
                <div :class="[ 'w-full aspect-square', 'border border-[#E7EAE9]', 'p-2', index % 2 !== 0 ? 'lg:order-2' : '' ]">
                    <div class="w-full h-full  bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                        <img v-if="aroma.imagem" :src="aroma.imagem" :alt="`Aroma ${aroma.nome}`" class="w-full h-full object-cover" />
                        <span v-else class="text-[#BFC0C0] text-sm  text-center px-5"> Imagem de {{ aroma.nome }} </span>
                    </div>
                </div>
                <div :class="[ 'flex flex-col justify-center', index % 2 !== 0 ? 'lg:order-1' : '' ]">
                    <h2 class="text-3xl text-[#0C2645] font-[Cinzel] mb-1 md:text-4xl"> {{ aroma.nome }} </h2>
                    <p v-if="aroma.subtitulo" class="text-[#2C2828] text-sm italic mb-5"> {{ aroma.subtitulo }} </p>
                    <div v-else class="mb-5"></div>
                    <p class="text-[#2C2828] text-sm md:text-xl leading-7 md:text-base md:leading-8">{{ aroma.descricao }}</p>
                </div>
            </div>
        </section>
    </main>
</template>