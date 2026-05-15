<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';

const menuAberto = ref(false);
const abrirMenu = () => {
    menuAberto.value = !menuAberto.value;
}

</script>
<template>   
    <header class="fixed z-50 top-0 left-0 w-full  bg-[#0C2645] p-8">
        <ul class="flex gap-5 items-center justify-between">
            <li>
                <button @click="abrirMenu">
                    <img src="/icons/menu-hamburger.svg" alt="Menu">
                </button>
            </li>
            <li class="w-20">
                <RouterLink to="/">
                    <img src="/img/logo.svg" alt="Lumena">
                </RouterLink>
            </li>
            <li class="text-white border-b flex w-20 pb-1 gap-5 font-sen">
                <p>Buscar</p> <img src="/icons/procurar.svg" alt="Procura">
            </li>
            <li>
                <RouterLink to="/login">
                <img src="/icons/usuario.svg" alt="Perfil">
                </RouterLink>
            </li>
            <li>
                <img src="/icons/sacola.svg" alt="Sacola">
            </li>
        </ul>
        <div v-if="menuAberto"
            class="fixed top-24 -z-10 left-0 w-1/2 h-full bg-[#0C2645] text-[#F8F9F9] shadow-lg p-6 flex flex-col gap-80">
            <div class="text-[#F8F9F9] flex flex-col gap-6 ">
                <router-link to="/" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Início</router-link>
                <router-link to="/produtos" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Produtos</router-link>
                <router-link to="/login" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Perfil</router-link>
                <router-link to="/sacola" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Sacola</router-link>
            </div>
        </div>
    </header>
</template>