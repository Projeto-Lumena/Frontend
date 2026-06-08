import { defineStore } from 'pinia'
import authApi from '../api/authApi'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    cadastroRealizado: true,

    user: {
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

        console.log(data)

        this.user = {
          name: data.name,
          email: data.email,
          telefone: data.telefone,
          nascimento: data.nascimento,
          foto: data.foto?.url || ''
        }

      } catch (error) {
        console.log(error)
      }
    }
  }
})