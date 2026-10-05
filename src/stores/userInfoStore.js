import { defineStore } from 'pinia'
import authApi from '../api/authApi'
import comprasApi from '../api/comprasApi'

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
async carregarPedidos() {
    try {
        const pedidosApi = await comprasApi.getAll()
        this.pedidos = pedidosApi.map(pedido => {
            const primeiroItem = pedido.itens?.[0] || {}
            const produto = primeiroItem.produto || {}
            const variacao = primeiroItem.variacao || {}

            const imagem = produto.imagem?.url || produto.imagem || ''

            const quantidade = (pedido.itens || []).reduce(
                (total, item) => total + Number(item.quantidade || 0),
                0
            )

            const dadosSalvos = localStorage.getItem(`lumena-pedido-${pedido.id}`)

            let dadosLocais = {}

            if (dadosSalvos) {
                try {
                    dadosLocais = JSON.parse(dadosSalvos)
                } catch (error) {
                    console.error('Erro ao ler pedido local:', error)
                }
            }

            return {
                id: pedido.id,
                nome: dadosLocais.nome || produto.nome || 'Produto',
                imagem: dadosLocais.imagem || imagem,
                tamanho: dadosLocais.tamanho || variacao.tamanho || '',
                quantidade: dadosLocais.quantidade || quantidade,
                total: dadosLocais.total ?? Number(pedido.total || 0),
                status: dadosLocais.status || (
                    pedido.status === 'Finalizado'
                        ? 'Pedido Realizado'
                        : pedido.status
                ),
                data: dadosLocais.data || '',
                itens: pedido.itens || []
            }
        })

    } catch (error) {
        console.error('ERRO AO CARREGAR PEDIDOS:', error)
        console.error('RESPOSTA DO BACKEND:', error.response?.data)
        this.pedidos = []
    }
},
        async fetchUser() {
            try {
                const { data } = await authApi.getMe()

                this.user = {
                    id: data.id,
                    name: data.name || '',
                    email: data.email || '',
                    telefone: data.telefone || '',
                    nascimento: data.nascimento || '',
                    foto: data.foto?.url || data.foto || ''
                }

                await this.carregarPedidos()

            } catch (error) {
                console.error('Erro ao carregar usuário:', error)
            }
        }
    }
})
