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
    <header class="fixed z-50 top-0 left-0 w-full bg-[#0C2645] p-8">
        <ul class="flex gap-5 items-center justify-between sm:gap-20 md:gap-10">
            <li>
                <ul class="flex items-center gap-5">
                    <li class="md:hidden">
                        <button @click="abrirMenu">
                            <img src="/icons/menu-hamburger.svg" alt="Menu">
                        </button>
                    </li>
                    <li class="w-20 mb-2 xl:mr-30 lg:ml-8">
                        <router-link to="/">
                            <img src="/img/logo.svg" alt="Lumena">
                        </router-link>
                    </li>
                </ul>
            </li>
            <li>
                <ul class="flex items-center gap-5 xl:gap-15 xl:mr-10">
                    <li
                        class="text-white border-b flex w-20 pb-1 gap-5 font-sen md:w-50 md:gap-30 xl:w-80  justify-between 2xl:gap-60">
                        <p>Buscar</p> <img src="/icons/procurar.svg" alt="Procura">
                    </li>
                    <li>
                        <RouterLink to="/perfil">
                            <img class="w-6 md:w-8" src="/icons/usuario.svg" alt="Perfil ">
                        </RouterLink>
                    </li>
                    <li>
                        <img class="w-6 md:w-8" src="/icons/sacola.svg" alt="Sacola">
                    </li>
                    <button v-if="authStore.isAuthenticated" @click="handleLogout"
                        class="flex flex-col items-center justify-center text-white font-sen w-6 md:w-8">
                        <img class="w-6 md:w-8 text-white" src="/icons/user-logout-white.svg" alt="Logout">
                        <span class="text-xs md:text-sm">Sair</span>
                    </button>
                </ul>
            </li>
        </ul>
        <div v-if="menuAberto"
            class="fixed top-24 -z-10 left-0 w-1/2 h-full bg-[#0C2645] text-[#F8F9F9] shadow-lg p-6 flex flex-col gap-80">
            <div class="text-[#F8F9F9] flex flex-col gap-6 ">
                <router-link to="/" @click="fecharMenu"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Início</router-link>
                <router-link to="/produtos" @click="fecharMenu"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Produtos</router-link>
                <router-link :to="authStore.isAuthenticated ? '/perfil' : '/login'" @click="fecharMenu"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Perfil</router-link>
                <router-link to="/sacola" @click="fecharMenu"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Sacola</router-link>
            </div>
        </div>
    </header>
</template>