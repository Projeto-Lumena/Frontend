<script setup>
import { ref } from 'vue'
import Input from '@/components/FormComponents/InputComponent.vue'
import Button from '@/components/FormComponents/ButtonComponent.vue'
import { useInputStore } from '@/stores/userInputStore'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/authApi'

const authStore = useAuthStore()
const router = useRouter()
const store = useInputStore()

const fotoPreview = ref(null)
const fotoAttachmentKey = ref(null)
const uploadingFoto = ref(false)
const erroFoto = ref('')
const fotoFile = ref(null)

function handleFotoChange(event) {
  const file = event.target.files[0]

  if (!file) return

  fotoFile.value = file
  fotoPreview.value = URL.createObjectURL(file)
}

async function handleRegister() {
  store.resetErrors()

  let possuiErro = false

  if (!store.campos.userInputNome.value.trim()) {
    store.campos.userInputNome.error = 'Informe seu nome completo.'
    possuiErro = true
  }

  if (!store.campos.userInputDataNascimento.value) {
    store.campos.userInputDataNascimento.error = 'Informe sua data de nascimento.'
    possuiErro = true
  }

  if (!store.campos.userInputTelefone.value.trim()) {
    store.campos.userInputTelefone.error = 'Informe seu telefone.'
    possuiErro = true
  }

  if (!store.campos.userInputEmail.value.trim()) {
    store.campos.userInputEmail.error = 'Informe seu e-mail.'
    possuiErro = true
  }

  if (!store.campos.userInputSenha.value.trim()) {
    store.campos.userInputSenha.error = 'Informe sua senha.'
    possuiErro = true
  }

  if (possuiErro) {
    return
  }

  try {
    const userData = {
      name: store.campos.userInputNome.value,
      email: store.campos.userInputEmail.value,
      telefone: store.campos.userInputTelefone.value,
      nascimento: store.campos.userInputDataNascimento.value,
      password: store.campos.userInputSenha.value,
    }

    // 1. Primeiro cria o usuário e faz login
    await authStore.register(userData)

    // 2. Agora já existe token
    // então podemos enviar a foto
    if (fotoFile.value) {
      uploadingFoto.value = true

      const response = await authApi.uploadImage(fotoFile.value)

      const fotoAttachmentKey = response.data.attachment_key

      // 3. Busca o usuário recém-criado
      const { data: usuario } = await authApi.getMe()

      // 4. Vincula a foto ao usuário
      await authApi.updateProfile(usuario.id, {
        foto_attachment_key: fotoAttachmentKey
      })

      uploadingFoto.value = false
    }

    store.resetForm()

    fotoPreview.value = null
    fotoFile.value = null

    router.push({
      path: '/perfil',
      query: {
        cadastro: 'success'
      }
    })

  } catch (err) {
    uploadingFoto.value = false

    const errors = err.response?.data

    if (!errors) {
      console.error(err)
      return
    }

    Object.keys(errors).forEach((campo) => {
      switch (campo) {
        case 'name':
          store.campos.userInputNome.error = errors[campo][0]
          break

        case 'email':
          store.campos.userInputEmail.error = errors[campo][0]
          break

        case 'telefone':
          store.campos.userInputTelefone.error = errors[campo][0]
          break

        case 'nascimento':
          store.campos.userInputDataNascimento.error = errors[campo][0]
          break

        case 'password':
          store.campos.userInputSenha.error = errors[campo][0]
          break
      }
    })

    console.error('Erro no cadastro:', err)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row md:mt-20 lg:mt-10">

    <div class="w-full lg:w-1/2 flex-col px-6 lg:px-30">

      <div class="max-w-lg mx-auto w-full mt-15 md:mt-20 lg:mt-40">

        <h1 class="text-3xl md:text-4xl lg:text-5xl text-center text-[#0C2645] font-[Cinzel]">
          Cadastro
        </h1>

        <Input v-for="(campo, key) in store.campos" :key="key" :campo="campo"
          @update="(value) => campo.value = value" />

        <!-- FOTO DE PERFIL -->
        <div class="mt-6">

          <label class="block text-sm mb-2">
            Foto de perfil
          </label>

          <!-- PREVIEW -->
          <div v-if="fotoPreview" class="mb-3 flex items-center gap-3">
            <img :src="fotoPreview" alt="Preview da foto" class="w-[90px] h-[90px] object-cover border border-gray-300">

            <span class="text-sm text-gray-500">
              Foto selecionada
            </span>
          </div>

          <!-- BOTÃO -->
          <label class="inline-block border border-[#0C2645] px-4 py-2 cursor-pointer text-[#0C2645]">
            Adicionar foto

            <input type="file" accept="image/jpeg,image/png" class="hidden" @change="handleFotoChange">
          </label>

        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between my-10">

          <Button label="Limpar" variant="azul" @click="store.resetForm" />

          <Button label="Cadastrar-me" @click="handleRegister" :disabled="uploadingFoto" />

        </div>

      </div>

    </div>

    <div class="hidden lg:block lg:w-1/2 h-screen">

      <img src="/img/imgCadastro.png" alt="" class="w-full h-full object-cover">

    </div>

  </div>
</template>