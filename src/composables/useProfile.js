
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userInfoStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useProfileEditor } from '@/composables/useProfileEditor'

export function useProfile() {
    const router = useRouter()
    const route = useRoute()

    const authStore = useAuthStore()
    const userStore = useUserStore()

    const user = computed(() => userStore.user)

    const pedidos = computed(() =>
        userStore.pedidos.filter(pedido => pedido.status !== 'Carrinho')
    )

    const mensagemParabens = ref(false)

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

    function handleLogout() {
        authStore.logout()
        router.push('/login')
    }

    const editor = useProfileEditor(user)

    return {
        user,
        pedidos,
        mensagemParabens,
        ...editor,
        handleLogout
    }
}
