<script setup>
import { useProfile } from '@/composables/useProfile'

import ProfileSummary from '@/components/profile/ProfileSummary.vue'
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue'
import ProfileOrders from '@/components/profile/ProfileOrders.vue'

const {
  user,
  pedidos,
  mensagemParabens,
  editando,
  salvando,
  erro,
  form,
  fotoPreview,
  uploadingFoto,
  iniciarEdicao,
  cancelarEdicao,
  handleFotoChange,
  salvarPerfil,
  handleLogout
} = useProfile()
</script>

<template>
  <div class="w-full py-8 px-4 lg:flex lg:justify-between lg:gap-10 md:mt-20">
    <div class="lg:w-1/3 lg:mr-10 lg:ml-10 lg:mt-10">
      <ProfileSummary :user="user" :mensagem-parabens="mensagemParabens" @edit="iniciarEdicao" @logout="handleLogout" />

      <ProfileEditForm v-if="editando" :form="form" :erro="erro" :foto-preview="fotoPreview" :user-foto="user.foto"
        :uploading-foto="uploadingFoto" :salvando="salvando" @foto-change="handleFotoChange" @save="salvarPerfil"
        @cancel="cancelarEdicao" />
    </div>

    <div class="mt-8 lg:mt-0 lg:w-2/3 lg:ml-10 lg:mr-10 lg:mt-10">
      <ProfileOrders :pedidos="pedidos" />
    </div>
  </div>
</template>
