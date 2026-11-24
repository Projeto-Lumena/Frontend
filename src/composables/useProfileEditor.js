import { ref } from 'vue'
import { useUserStore } from '@/stores/userInfoStore'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/authApi'

export function useProfileEditor(user) {
    const authStore = useAuthStore()
    const userStore = useUserStore()

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

    return {
        editando,
        salvando,
        erro,
        form,
        fotoPreview,
        uploadingFoto,
        iniciarEdicao,
        cancelarEdicao,
        handleFotoChange,
        salvarPerfil
    }
}
