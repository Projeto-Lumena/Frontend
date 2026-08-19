<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userInfoStore'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/authApi'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const pedidos = computed(() => userStore.pedidos)

const mensagemParabens = ref(false)

const editando = ref(false)
const salvando = ref(false)
const erro = ref('')

const form = ref({
  name: '',
  email: '',
  telefone: '',
  nascimento: ''
})

const fotoPreview = ref(null)
const fotoAttachmentKey = ref(null)
const uploadingFoto = ref(false)

onMounted(async () => {
  await userStore.fetchUser()

  if (route.query.cadastro === 'success') {
    mensagemParabens.value = true

    router.replace({
      path: route.path,
      query: {}
    })

    setTimeout(() => {
      mensagemParabens.value = false
    }, 3000)
  }
})

function iniciarEdicao() {
  form.value = {
    name: user.value.name || '',
    email: user.value.email || '',
    telefone: user.value.telefone || '',
    nascimento: user.value.nascimento || ''
  }

  fotoPreview.value = null
  fotoAttachmentKey.value = null
  erro.value = ''
  editando.value = true
}

function voltarAoTopo() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function cancelarEdicao() {
  editando.value = false
  fotoPreview.value = null
  fotoAttachmentKey.value = null
  erro.value = ''

  voltarAoTopo()
}

async function handleFotoChange(event) {
  const file = event.target.files[0]

  if (!file) return

  fotoPreview.value = URL.createObjectURL(file)
  uploadingFoto.value = true
  erro.value = ''

  try {
    const response = await authApi.uploadImage(file)

    fotoAttachmentKey.value = response.data.attachment_key

  } catch (err) {
    console.error('Erro ao fazer upload da foto:', err)

    fotoPreview.value = null
    fotoAttachmentKey.value = null

    erro.value = 'Não foi possível enviar a foto.'
  } finally {
    uploadingFoto.value = false
  }
}

async function salvarPerfil() {
  erro.value = ''

  if (!form.value.name.trim()) {
    erro.value = 'O nome não pode ficar vazio.'
    return
  }

  salvando.value = true

  try {
    const payload = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      telefone: form.value.telefone.trim(),
      nascimento: form.value.nascimento
    }

    if (fotoAttachmentKey.value) {
      payload.foto_attachment_key = fotoAttachmentKey.value
    }

    console.log('Enviando perfil:', payload)

    const usuarioAtualizado = await authStore.updateProfile(
      user.value.id,
      payload
    )

    console.log('Usuário atualizado:', usuarioAtualizado)

    userStore.user = {
      id: usuarioAtualizado.id,
      name: usuarioAtualizado.name,
      email: usuarioAtualizado.email,
      telefone: usuarioAtualizado.telefone,
      nascimento: usuarioAtualizado.nascimento,
      foto: usuarioAtualizado.foto?.url || ''
    }

    editando.value = false
    fotoPreview.value = null
    fotoAttachmentKey.value = null

    voltarAoTopo()

  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)

    if (err.response?.data) {
      console.error('Resposta do servidor:', err.response.data)
    }

    erro.value = 'Não foi possível atualizar o perfil.'

  } finally {
    salvando.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

</script>

<template>
  <div class="min-h-screen bg-[#F8F9F9] md:mt-30 py-8 px-4 lg:flex lg:justify-between w-full">
    <div class="lg:w-1/3 lg:mr-10 lg:ml-10 lg:mt-10">

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

        <p class="text-md text-[#2C2828]">
          Bem vindo(a),
        </p>

        <h1 class="text-lg text-[#0C2645] font-serif uppercase">
          {{ user.name }}
        </h1>

        <div class="border-b border-[#0C2645] mt-2"></div>

      </div>

      <div class="flex gap-4 mt-5 w-full justify-center lg:justify-start">

        <div
          class="w-[165px] h-[165px] border border-gray-300 flex items-center justify-center overflow-hidden bg-white"
        >
          <img
            v-if="user.foto"
            :src="user.foto"
            alt="Foto"
            class="w-full h-full object-cover"
          >

          <img
            v-else
            src="/icons/usuario.svg"
            alt="Usuário"
            class="w-14 h-14 object-contain"
          >
        </div>

        <div class="flex flex-col justify-between h-[165px]">

          <ul class="text-[13px] leading-6">

            <li>
              <img
                src="/icons/calendario.svg"
                alt="Data de Nascimento"
                class="inline-block w-4 mr-1"
              >
              {{ user.nascimento }}
            </li>

            <li class="mt-2">
              <img
                src="/icons/gmail-blue.svg"
                alt="Email"
                class="inline-block w-4 mr-1"
              >
              {{ user.email }}
            </li>

            <li class="mt-2">
              <img
                src="/icons/telefone.svg"
                alt="Telefone"
                class="inline-block w-4 mr-1"
              >
              {{ user.telefone }}
            </li>

          </ul>

          <div class="flex gap-2">

            <button
              @click="iniciarEdicao"
              class="border border-gray-300 bg-[#0C2645] px-3 py-2 text-[#F8F9F9]"
            >
              Editar perfil
            </button>

            <button
              @click="handleLogout"
              class="flex items-center justify-center border border-gray-300 bg-[#0C2645] px-3 py-2 text-[#F8F9F9]"
            >
              <img
                src="/icons/user-logout-white.svg"
                alt="Logout"
              >

              <span class="ml-2">
                Sair
              </span>
            </button>

          </div>

        </div>
      </div>

      <!-- EDITAR PERFIL -->
      <div
        v-if="editando"
        class="mt-6 border border-gray-300 bg-white p-5"
      >

        <h2 class="text-[#0C2645] font-serif text-lg mb-4">
          EDITAR PERFIL
        </h2>

        <div
          v-if="erro"
          class="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 text-sm"
        >
          {{ erro }}
        </div>

        <div class="grid gap-4">

          <!-- NOME -->
          <div>
            <label class="block text-sm mb-1">
              Nome
            </label>

            <input
              v-model="form.name"
              type="text"
              class="w-full border border-gray-300 p-2"
            >
          </div>

          <!-- EMAIL -->
          <div>
            <label class="block text-sm mb-1">
              E-mail
            </label>

            <input
              v-model="form.email"
              type="email"
              class="w-full border border-gray-300 p-2"
            >
          </div>

          <!-- TELEFONE -->
          <div>
            <label class="block text-sm mb-1">
              Telefone
            </label>

            <input
              v-model="form.telefone"
              type="text"
              class="w-full border border-gray-300 p-2"
            >
          </div>

          <!-- NASCIMENTO -->
          <div>
            <label class="block text-sm mb-1">
              Data de nascimento
            </label>

            <input
              v-model="form.nascimento"
              type="text"
              placeholder="DD/MM/AAAA"
              class="w-full border border-gray-300 p-2"
            >
          </div>

          <!-- FOTO -->
          <div>

            <label class="block text-sm mb-2">
              Foto
            </label>

            <!-- PREVIEW -->
            <div
              v-if="fotoPreview || user.foto"
              class="mb-3 flex items-center gap-3"
            >

              <img
                :src="fotoPreview || user.foto"
                alt="Preview da foto"
                class="w-[90px] h-[90px] object-cover border border-gray-300"
              >

              <span class="text-sm text-gray-500">
                {{ fotoPreview ? 'Nova foto selecionada' : 'Foto atual' }}
              </span>

            </div>

            <!-- BOTÃO -->
            <label
              class="inline-block border border-[#0C2645] px-4 py-2 cursor-pointer text-[#0C2645]"
              :class="{
                'opacity-50 cursor-not-allowed': uploadingFoto
              }"
            >

              {{ uploadingFoto ? 'Enviando...' : 'Alterar foto' }}

              <input
                type="file"
                accept="image/jpeg,image/png"
                class="hidden"
                :disabled="uploadingFoto"
                @change="handleFotoChange"
              >

            </label>

          </div>

          <!-- BOTÕES -->
          <div class="flex gap-2 mt-2">

            <button
              @click="salvarPerfil"
              :disabled="salvando || uploadingFoto"
              class="bg-[#0C2645] text-white px-5 py-2 disabled:opacity-50"
            >
              {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
            </button>

            <button
              @click="cancelarEdicao"
              :disabled="salvando"
              class="border border-gray-300 px-5 py-2"
            >
              Cancelar
            </button>

          </div>

        </div>
      </div>

    </div>

    <!-- PEDIDOS -->
    <div class="mt-8 lg:mt-0 lg:w-2/3 lg:ml-10 lg:mr-10 lg:mt-10">

      <h2 class="text-[#0C2645] font-serif text-lg mb-4">
        MEUS PEDIDOS:
      </h2>

      <div
        v-if="pedidos.length === 0"
        class="border border-gray-300 bg-white p-8 lg:p-19 text-center"
      >

        <p class="text-[#0C2645] font-serif">
          Você ainda não possui pedidos.
        </p>

        <p class="text-sm text-gray-500 mt-2">
          Quando você realizar uma compra, ela aparecerá aqui.
        </p>

      </div>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-2"
      >

        <div
          v-for="pedido in pedidos"
          :key="pedido.id"
          class="border border-gray-300 p-3 bg-white"
        >

          <div class="flex gap-3">

            <img
              :src="pedido.imagem"
              alt="Produto"
              class="w-[85px] h-[85px] object-cover"
            >

            <div class="flex-1">

              <div class="flex justify-between gap-2">

                <h3 class="text-[14px] leading-4">
                  {{ pedido.nome }}
                </h3>

                <span class="text-[10px] text-[#2C2828] whitespace-nowrap">
                  {{ pedido.status }}
                </span>

              </div>

              <div class="text-[11px] text-[#2C2828] mt-2">

                <p>{{ pedido.data }}</p>
                <p>Tamanho: {{ pedido.tamanho }}</p>
                <p>Quantidade: {{ pedido.quantidade }}</p>

              </div>

              <p class="mt-2 text-[14px]">
                Total: {{ pedido.total }}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>