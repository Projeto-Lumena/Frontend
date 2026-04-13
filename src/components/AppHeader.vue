<script setup>
import { ref } from 'vue'

const menuAberto = ref(false);
const abrirMenu = () => {
    menuAberto.value = !menuAberto.value;
}

</script>
<template>
    <header class="bg-[#0C2645] p-8">
        <ul class="flex gap-5 items-center">
            <li>
                <button @click="abrirMenu">
                    <img src="/icons/menu-hamburger.svg" alt="Menu">
                </button>
            </li>
            <li class="w-20">
                <img src="/img/logo.svg" alt="Lumena">
            </li>
            <li class="text-white border-b flex w-20 pb-1 gap-5 font-sen">
                <p>Buscar</p> <img src="/icons/procurar.svg" alt="Procura">
            </li>
            <li>
                <img src="/icons/usuario.svg" alt="Perfil">
            </li>
            <li>
                <img src="/icons/sacola.svg" alt="Sacola">
            </li>
        </ul>
        <div v-if="menuAberto"
            class="fixed top-24 left-0 w-1/2 h-screen bg-[#0C2645] text-[#F8F9F9] shadow-lg p-6 flex flex-col gap-80 ">
            <div class="text-[#F8F9F9] flex flex-col gap-6 ">
                <router-link to="/" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Início</router-link>
                <router-link to="/produtos" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Produtos</router-link>
                <router-link to="/perfil" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Perfil</router-link>
                <router-link to="/sacola" class="p-2 font-sen hover:font-bold router-link-active:font-bold">Sacola</router-link>

            </div>
            <ul class="text-sm">
                <li class="flex gap-1 font-sen mb-5">
                    <img src="/icons/instagram.svg" alt="Perfil">
                    <p>@lumena.aromas</p>
                </li>
                <li class="flex gap-1 font-sen mb-5">
                    <img src="/icons/whatsapp.svg" alt="Perfil">
                    <p>+55 47 9697-3888</p>
                </li>
                <li class="flex gap-1 font-sen mb-5">
                    <img src="/icons/gmail.svg" alt="Perfil">
                    <p>lumena.lah@gmail.com</p>
                </li>
            </ul>
        </div>
    </header>
</template>