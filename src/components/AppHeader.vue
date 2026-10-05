<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SearchComponent from '@/components/SearchComponent.vue'

const authStore = useAuthStore()
const showBagMessage = ref(false)
const router = useRouter()

function acessarSacola() {
    if (!authStore.isAuthenticated) {
        showBagMessage.value = true

        setTimeout(() => {
            showBagMessage.value = false
        }, 4000)

        return
    }

    router.push('/sacola')
}

</script>
<template>
    <Transition name="fade">
        <div v-if="showBagMessage" class="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-red-700 shadow-lg text-center">
            <span class="text-lg">!</span>
            <span>
                Faça login para acessar sua sacola.
            </span>
        </div>
    </Transition>
    <header class="hidden md:block fixed z-50 top-0 left-0 w-full bg-[#0C2645] p-5">
        <ul class="flex gap-5 items-center justify-between sm:gap-20 md:gap-10">
            <li>
                <ul class="flex items-center gap-5">
                    <li class="w-20 mb-2 xl:mr-8 lg:ml-8">
                        <RouterLink to="/">
                            <img src="/img/logo.svg" alt="Lumena">
                        </RouterLink>
                    </li>
                    <li>
                        <SearchComponent />
                    </li>
                </ul>
            </li>
            <li>
                <ul class="flex items-center gap-10 xl:gap-20 xl:mr-10">
                    <li>
                        <RouterLink to="/">
                            <span class="text-lg text-white hover:font-bold">Início</span>
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/aromas">
                            <span class="text-lg text-white hover:font-bold">Aromas</span>
                        </RouterLink>
                    </li>
                    <li>
                        <button type="button" @click="acessarSacola" class="text-lg text-white hover:font-bold">
                            Sacola
                        </button>
                    </li>
                    <li>
                        <RouterLink to="/perfil">
                            <span class="text-lg text-white hover:font-bold">Perfil</span>
                        </RouterLink>
                    </li>
                </ul>
            </li>
        </ul>
    </header>
    <div class="md:hidden fixed bottom-0 z-50 w-full h-15 bg-[#0C2645]">
        <ul class="h-full flex items-center justify-center">
            <li class="h-full w-30">
                <RouterLink to="/aromas" class="h-full w-full flex flex-col items-center justify-center text-white"
                    active-class="text-[#FDA202]">
                    <img class="w-5 h-5" src="/icons/aromas.png" alt="Aroma">
                    <span class="text-sm font-sen">Aromas</span>
                </RouterLink>
            </li>
            <li class="h-full w-30">
                <button type="button" @click="acessarSacola" class="h-full w-full flex flex-col items-center justify-center text-white">
                    <img class="w-5 h-5" src="/icons/sacola.svg" alt="Sacola">
                    <span class="text-sm font-sen"> Sacola  </span>
                </button>
            </li>
            <li class="h-full w-30">
                <RouterLink to="/" class="h-full w-full flex flex-col items-center justify-center text-white"  active-class="text-[#FDA202]">
                    <img class="w-5 h-5" src="/icons/home.svg" alt="Início">
                    <span class="text-sm font-sen">Início</span>
                </RouterLink>
            </li>
            <li class="h-full w-30">
                <SearchComponent />
            </li>
            <li class="h-full w-30">
                <RouterLink :to="authStore.isAuthenticated ? '/perfil' : '/login'" class="h-full w-full flex flex-col items-center justify-center text-white" active-class="text-[#FDA202]">
                    <img class="w-5 h-5" src="/icons/usuario.svg" alt="Perfil">
                    <span class="text-sm font-sen"> Perfil</span>
                </RouterLink>
            </li>
        </ul>
    </div>
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