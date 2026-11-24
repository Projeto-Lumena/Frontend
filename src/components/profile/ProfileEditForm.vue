<script setup>
defineProps({
    form: {
        type: Object,
        required: true
    },
    erro: {
        type: String,
        default: ''
    },
    fotoPreview: {
        type: String,
        default: null
    },
    userFoto: {
        type: String,
        default: ''
    },
    uploadingFoto: {
        type: Boolean,
        default: false
    },
    salvando: {
        type: Boolean,
        default: false
    }
})

defineEmits(['save', 'cancel', 'foto-change'])
</script>

<template>
    <div class="mt-6 border border-gray-300 bg-white p-5">
        <h2 class="text-[#0C2645] font-serif text-lg mb-4">
            EDITAR PERFIL
        </h2>

        <div v-if="erro" class="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 text-sm">
            {{ erro }}
        </div>

        <div class="grid gap-4">
            <div>
                <label class="block text-sm mb-1">Nome</label>
                <input v-model="form.name" type="text" class="w-full border border-gray-300 p-2">
            </div>

            <div>
                <label class="block text-sm mb-1">E-mail</label>
                <input v-model="form.email" type="email" class="w-full border border-gray-300 p-2">
            </div>

            <div>
                <label class="block text-sm mb-1">Telefone</label>
                <input v-model="form.telefone" type="text" class="w-full border border-gray-300 p-2">
            </div>

            <div>
                <label class="block text-sm mb-1">Data de nascimento</label>
                <input v-model="form.nascimento" type="text" placeholder="DD/MM/AAAA"
                    class="w-full border border-gray-300 p-2">
            </div>

            <div>
                <label class="block text-sm mb-2">Foto</label>

                <div v-if="fotoPreview || userFoto" class="mb-3 flex items-center gap-3">
                    <img :src="fotoPreview || userFoto" alt="Preview da foto"
                        class="w-[90px] h-[90px] object-cover border border-gray-300">

                    <span class="text-sm text-gray-500">
                        {{ fotoPreview ? 'Nova foto selecionada' : 'Foto atual' }}
                    </span>
                </div>

                <label class="inline-block border border-[#0C2645] px-4 py-2 cursor-pointer text-[#0C2645]"
                    :class="{ 'opacity-50 cursor-not-allowed': uploadingFoto }">
                    {{ uploadingFoto ? 'Enviando...' : 'Alterar foto' }}

                    <input type="file" accept="image/jpeg,image/png" class="hidden" :disabled="uploadingFoto"
                        @change="$emit('foto-change', $event)">
                </label>
            </div>

            <div class="flex gap-2 mt-2">
                <button @click="$emit('save')" :disabled="salvando || uploadingFoto"
                    class="bg-[#0C2645] text-white px-5 py-2 disabled:opacity-50">
                    {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
                </button>

                <button @click="$emit('cancel')" :disabled="salvando" class="border border-gray-300 px-5 py-2">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>
