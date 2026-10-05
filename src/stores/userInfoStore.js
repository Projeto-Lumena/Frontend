import { defineStore } from 'pinia'
import authApi from '../api/authApi'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    cadastroRealizado: true,

    user: {
      id: null,
      name: '',
      email: '',
      telefone: '',
      nascimento: '',
      foto: ''
    },

    pedidos: []
  }),

  actions: {
    getPedidosKey() {
      const authStore = useAuthStore()

      if (!authStore.userEmail) {
        return null
      }

      return `lumena-pedidos-${authStore.userEmail}`
    },

    carregarPedidos() {
      const key = this.getPedidosKey()

      if (!key) {
        this.pedidos = []
        return
      }

      try {
        const pedidosSalvos = localStorage.getItem(key)

        if (!pedidosSalvos) {
          this.pedidos = []
          return
        }

        const pedidos = JSON.parse(pedidosSalvos)

        // Remove pedidos duplicados pelo ID
        const pedidosUnicos = pedidos.filter(
          (pedido, index, array) =>
            index === array.findIndex(item => item.id === pedido.id)
        )

        this.pedidos = pedidosUnicos

        // Atualiza o localStorage já sem os duplicados
        localStorage.setItem(
          key,
          JSON.stringify(pedidosUnicos)
        )

      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
        this.pedidos = []
      }
    },

    adicionarPedido(pedido) {
      const key = this.getPedidosKey()

      if (!key) {
        console.error('Usuário não identificado.')
        return
      }

      const pedidoJaExiste = this.pedidos.some(
        item => item.id === pedido.id
      )

      if (pedidoJaExiste) {
        return
      }

      this.pedidos.unshift(pedido)

      localStorage.setItem(
        key,
        JSON.stringify(this.pedidos)
      )
    },

    async fetchUser() {
      try {
        const { data } = await authApi.getMe()

        console.log('Usuário recebido:', data)

        this.user = {
          id: data.id,
          name: data.name,
          email: data.email,
          telefone: data.telefone,
          nascimento: data.nascimento,
          foto: data.foto?.url || ''
        }

        this.carregarPedidos()

      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    }
  }
})