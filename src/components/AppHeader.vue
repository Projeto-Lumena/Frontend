<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';

const menuAberto = ref(false);
const abrirMenu = () => {
    menuAberto.value = !menuAberto.value;
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
                        <img src="/img/logo.svg" alt="Lumena">
                    </li>
                    <li class="hidden md:flex gap-10 text-white font-sen xl:mr-40 2xl:mr-70">
                        <router-link to="/">Início</router-link>
                        <router-link to="/produtos">Produtos</router-link>
                        <router-link to="/perfil">Perfil</router-link>
                        <router-link to="/sacola">Sacola</router-link>
                    </li>
                </ul>
            </li>
            <li>
                <ul class="flex items-center gap-5 xl:gap-15 xl:mr-10">
                    <li class="text-white border-b flex w-20 pb-1 gap-5 font-sen md:w-50 md:gap-30 xl:w-80 2xl:gap-60">
                        <p>Buscar</p> <img src="/icons/procurar.svg" alt="Procura">
                    </li>
                    <li>
                    <RouterLink to="/login">
                        <img class="w-6 md:w-8" src="/icons/usuario.svg" alt="Perfil ">
                        </RouterLink>
                    </li>
                    <li>
                        <img class="w-6 md:w-8" src="/icons/sacola.svg" alt="Sacola">
                    </li>
                </ul>
            </li>
        </ul>
        <div v-if="menuAberto"
            class="fixed top-24 -z-10 left-0 w-1/2 h-full bg-[#0C2645] text-[#F8F9F9] shadow-lg p-6 flex flex-col gap-80">
            <div class="text-[#F8F9F9] flex flex-col gap-6 ">
                <router-link to="/"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Início</router-link>
                <router-link to="/produtos"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Produtos</router-link>
                <router-link to="/login"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Perfil</router-link>
                <router-link to="/sacola"
                    class="p-2 font-sen hover:font-bold router-link-active:font-bold">Sacola</router-link>
            </div>
        </div>
    </header>
</template>