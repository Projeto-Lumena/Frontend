
import { ref } from 'vue'
import comprasApi from '@/api/comprasApi'

export function useOrderSubmission(options) {
    const fazendoPedido = ref(false)

    const {
        bagStore,
        userStore,
        router,
        metodoPagamento,
        tipoEntrega,
        location,
        enderecoManual,
        distanceKm,
        frete,
        totalPedido,
        podeFazerPedido
    } = options

    function salvarPedidoLocal(id, resumo) {
        const primeiroItem = resumo.itens[0] || {}

        const dados = {
            ...resumo,
            id,
            status: 'Pedido Realizado',
            nome: primeiroItem.nome || '',
            imagem: primeiroItem.imagem || '',
            tamanho: primeiroItem.tamanho || '',
            quantidade: resumo.itens.reduce(
                (total, item) => total + item.quantidade,
                0
            )
        }

        localStorage.setItem(`lumena-pedido-${id}`, JSON.stringify(dados))
    }

    async function fazerPedido() {
        if (!podeFazerPedido.value) return

        if (!bagStore.compraId) {
            alert('Não foi possível identificar sua sacola. Atualize a página e tente novamente.')
            return
        }

        fazendoPedido.value = true

        const resumoDoPedido = {
            metodoPagamento: metodoPagamento.value,
            tipoEntrega: tipoEntrega.value,
            endereco: location.value?.label || enderecoManual.value.trim() || '',
            distancia: distanceKm.value,
            frete: frete.value,
            subtotal: bagStore.subtotal,
            total: totalPedido.value,
            data: new Date().toLocaleDateString('pt-BR'),
            itens: bagStore.items.map(item => ({
                nome: item.nome,
                tamanho: item.tamanho,
                preco: item.preco,
                quantidade: item.quantidade,
                imagem: item.imagem
            }))
        }

        try {
            const compraSalva = await comprasApi.finalizar(bagStore.compraId)

            salvarPedidoLocal(compraSalva.id, resumoDoPedido)
            await userStore.carregarPedidos()

            bagStore.items = []
            bagStore.compraId = null

            router.push({
                name: 'pedido',
                params: { id: compraSalva.id }
            })
        } catch (error) {
            console.error('Erro ao fazer pedido:', error)

            if (error.response) {
                console.error('Resposta do backend:', error.response.data)

                alert(
                    error.response.data?.detail ||
                    'Não foi possível finalizar o pedido. Verifique os dados e tente novamente.'
                )
            } else {
                alert('Não foi possível conectar ao servidor. Verifique se o backend está em execução.')
            }
        } finally {
            fazendoPedido.value = false
        }
    }

    return {
        fazendoPedido,
        fazerPedido
    }
}
