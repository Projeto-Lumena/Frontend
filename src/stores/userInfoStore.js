import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    cadastroRealizado: true,

    user: {
      nome: 'Nome Sobrenome',
      birthdata: 'DD/MM/AAAA',
      email: 'gmail@gmail.com',
      phone: '(00) 00000-0000',
      photo: ''
    },

    pedidos: [
      {
        id: 1,
        nome: 'Vela Aromática - Flor de Laranjeira',
        status: 'Status',
        data: 'DD/MM/AAAA',
        tamanho: 'P',
        quantidade: 1,
        total: 'R$30,00',
        imagem: ''
      },
      {
        id: 2,
        nome: 'Vela Aromática - Capim Limão',
        status: 'Status',
        data: 'DD/MM/AAAA',
        tamanho: 'M',
        quantidade: 1,
        total: 'R$40,00',
        imagem: ''
      }
    ]
  })
})