<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const menuAberto = ref(false);
const abrirMenu = () => {
    menuAberto.value = !menuAberto.value;
}

const fecharMenu = () => {
    menuAberto.value = false
}

function handleLogout() {
    authStore.logout();
    router.push('/login');
}
</script>
<template>
    <header class="hidden md:block fixed z-50 top-0 left-0 w-full bg-[#0C2645] p-8 rounded-b-2xl">
        <ul class="flex gap-5 items-center justify-between sm:gap-20 md:gap-10">
            <li>
                <ul class="flex items-center gap-5">
                    <li class="w-20 mb-2 xl:mr-30 lg:ml-8">
                        <RouterLink to="/">
                            <img src="/img/logo.svg" alt="Lumena">
                        </RouterLink>
                    </li>
                </ul>
            </li>
            <li>
                <ul class="flex items-center gap-5 xl:gap-15 xl:mr-10">
                    <li
                        class="text-white border-b flex w-20 pb-1 gap-5 font-sen md:w-50 md:gap-30 xl:w-80 justify-between 2xl:gap-60">
                        <p>Buscar</p>
                        <img src="/icons/procurar.svg" alt="Procurar">
                    </li>
                    <li>
                        <RouterLink to="/perfil">
                            <img class="w-6 md:w-8" src="/icons/usuario.svg" alt="Perfil">
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/sacola">
                            <img class="w-6 md:w-8" src="/icons/sacola.svg" alt="Sacola">
                        </RouterLink>
                    </li>
                    <li>
                        <button v-if="authStore.isAuthenticated" @click="handleLogout"
                            class="flex flex-col items-center justify-center text-white font-sen w-6 md:w-8">
                            <img class="w-6 md:w-8" src="/icons/user-logout-white.svg" alt="Logout">
                            <span class="text-xs md:text-sm">Sair</span>
                        </button>
                    </li>
                </ul>
            </li>
        </ul>
    </header>
    <div class="md:hidden fixed bottom-0 z-50 w-full h-20 bg-[#0C2645] rounded-t-2xl">
        <ul class="h-full flex items-center justify-center">
            <li class="h-full w-30">
                <RouterLink to="/sacola" class="h-full w-full flex flex-col items-center justify-center gap-1 text-white"
                    active-class="text-[#FDA202]">
                    <img src="/icons/sacola.svg" alt="Sacola" class="w-6 h-6">
                    <span class="text-sm font-sen">Sacola </span>
                </RouterLink>
            </li>
            <li class="h-full w-30">
                <RouterLink to="/" class="h-full w-full flex flex-col items-center justify-center gap-1 text-white"
                    active-class="text-[#FDA202]">
                    <img src="/icons/home.svg" alt="Home" class="w-6 h-6">
                    <span class="text-sm font-sen">Home</span>
                </RouterLink>
            </li>
            <li class="h-full w-30">
                <RouterLink :to="authStore.isAuthenticated ? '/perfil' : '/login'"
                    class="h-full w-full flex flex-col items-center justify-center gap-1 text-white"
                    active-class="text-[#FDA202]">
                    <img src="/icons/usuario.svg" alt="Perfil" class="w-6 h-6">
                    <span class="text-sm font-sen"> Perfil</span>
                </RouterLink>
            </li> 
            <button v-if="authStore.isAuthenticated" @click="handleLogout"
                    class="h-full w-30 flex flex-col items-center justify-center gap-1 text-white">
                    <img class="w-6 h-6" src="/icons/user-logout-white.svg" alt="Logout">
                    <span class="text-sm font-sen">Sair</span>
            </button>
        </ul>
    </div>
</template>