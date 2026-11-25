
import { computed } from 'vue'

export function useOrder(
    bagStore,
    location,
    distanceKm,
    metodoPagamento,
    tipoEntrega
) {
    const frete = computed(() => {
        if (tipoEntrega.value !== 'Uber Entregas') return 0
        if (distanceKm.value === null) return 0

        return distanceKm.value * 2
    })

    const totalPedido = computed(() => {
        return Number(bagStore.subtotal || 0) + Number(frete.value || 0)
    })

    const podeFazerPedido = computed(() => {
        if (!metodoPagamento.value || !tipoEntrega.value) return false
        if (!bagStore.items.length) return false
        if (tipoEntrega.value === 'Uber Entregas' && !location.value) return false

        return true
    })

    function formatPrice(value) {
        return Number(value || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    function formatDistance(value) {
        return Number(value || 0).toFixed(2).replace('.', ',')
    }

    return {
        frete,
        totalPedido,
        podeFazerPedido,
        formatPrice,
        formatDistance
    }
}
