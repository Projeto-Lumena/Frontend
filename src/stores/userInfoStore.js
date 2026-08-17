import { defineStore } from 'pinia'
import authApi from '../api/authApi'

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

      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    }
  }
})