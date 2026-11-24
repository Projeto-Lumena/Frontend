<script setup>
defineProps({
    user: {
        type: Object,
        required: true
    },
    mensagemParabens: {
        type: Boolean,
        default: false
    }
})

defineEmits(['edit', 'logout'])
</script>

<template>
    <div>
        <transition name="fade">
            <div v-if="mensagemParabens" class="text-center mb-10 lg:text-left">
                <h2 class="text-[#0C2645] font-serif text-[28px]">
                    Parabéns!
                </h2>
                <p class="text-[18px] text-[#2C2828]">
                    Cadastro realizado com sucesso.
                </p>
            </div>
        </transition>

        <div class="text-center lg:text-left">
            <p class="text-md text-[#2C2828]">Bem vindo(a),</p>

            <h1 class="text-lg text-[#0C2645] font-serif uppercase">
                {{ user.name }}
            </h1>

            <div class="border-b border-[#0C2645] mt-2"></div>
        </div>

        <div class="flex gap-4 mt-5 w-full justify-center lg:justify-start">
            <div
                class="w-[165px] h-[165px] border border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                <img v-if="user.foto" :src="user.foto" alt="Foto" class="w-full h-full object-cover">

                <img v-else src="/icons/usuario.svg" alt="Usuário" class="w-14 h-14 object-contain">
            </div>

            <div class="flex flex-col justify-between h-[165px]">
                <ul class="text-[13px] leading-6">
                    <li>
                        <img src="/icons/calendario.svg" alt="Data de Nascimento" class="inline-block w-4 mr-1">
                        {{ user.nascimento }}
                    </li>

                    <li class="mt-2">
                        <img src="/icons/gmail-blue.svg" alt="Email" class="inline-block w-4 mr-1">
                        {{ user.email }}
                    </li>

                    <li class="mt-2">
                        <img src="/icons/telefone.svg" alt="Telefone" class="inline-block w-4 mr-1">
                        {{ user.telefone }}
                    </li>
                </ul>

                <div class="flex gap-2">
                    <button @click="$emit('edit')" class="border border-gray-300 bg-[#0C2645] px-3 py-2 text-[#F8F9F9]">
                        Editar perfil
                    </button>

                    <button @click="$emit('logout')"
                        class="flex items-center justify-center border border-gray-300 bg-[#0C2645] px-3 py-2 text-[#F8F9F9]">
                        <img src="/icons/user-logout-white.svg" alt="Logout">
                        <span class="ml-2">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
