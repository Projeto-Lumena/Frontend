import { defineStore } from 'pinia'
import authApi from '../api/authApi'
import comprasApi from '../api/comprasApi'
import { useProductsStore } from '@/stores/products'

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
                const productsStore = useProductsStore()

                // Garante que os produtos estejam carregados para obter as URLs das imagens.
                if (productsStore.products.length === 0) {
                    await productsStore.fetchProducts()
                }

                const pedidosApi = await comprasApi.getAll()

                this.pedidos = pedidosApi.map(pedido => {
                    const itens = pedido.itens || []
                    const primeiroItem = itens[0] || {}

                    const produto = primeiroItem.produto || {}
                    const variacao = primeiroItem.variacao || {}

                    // Procura o produto completo na lista de produtos.
                    const produtoCompleto = productsStore.products.find(
                        p => String(p.id) === String(produto.id)
                    )

                    // Recupera a URL correta da imagem.
                    const imagem = produtoCompleto?.imagem?.url || ''

                    // Soma as quantidades de todos os itens do pedido.
                    const quantidade = itens.reduce(
                        (total, item) => total + Number(item.quantidade || 0),
                        0
                    )

                    // Recupera informações complementares salvas localmente.
                    let dadosLocais = {}

                    const dadosSalvos = localStorage.getItem(
                        `lumena-pedido-${pedido.id}`
                    )

                    if (dadosSalvos) {
                        try {
                            dadosLocais = JSON.parse(dadosSalvos)
                        } catch (error) {
                            console.error('Erro ao ler pedido local:', error)
                        }
                    }

                    // Adapta o status do backend para a apresentação.
                    const status = pedido.status === 'Finalizado'
                        ? 'Pedido Realizado'
                        : pedido.status

                    // Calcula o total a partir dos itens caso necessário.
                    const totalItens = itens.reduce(
                        (total, item) => total + Number(item.total || 0),
                        0
                    )

                    return {
                        id: pedido.id,
                        nome: produto.nome || 'Produto',
                        imagem,
                        tamanho: variacao.tamanho || '',
                        quantidade,
                        total: Number(pedido.total ?? totalItens),
                        status,
                        data: dadosLocais.data || '',
                        itens
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
