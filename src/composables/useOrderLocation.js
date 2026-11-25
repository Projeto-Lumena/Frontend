import { ref } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'
import geocodingApi from '@/api/geocodingApi'

const STORE_ADDRESS = 'R. José Gomes de Freitas, 160 - Costa e Silva, Joinville - SC, 89220-780'
const WHATSAPP_VENDEDORA = '554796973888'

export function useOrderLocation(tipoEntrega, metodoPagamento) {
    const {
        location,
        loadingLocation,
        locationError,
        requestCurrentLocation,
        setLocationLabel
    } = useGeolocation()

    const enderecoManual = ref('')
    const buscandoEndereco = ref(false)
    const distanceKm = ref(null)

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2
        const c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        )
        return R * c
    }

    async function calcularFretePorLocalizacao(currentLocation) {
        try {
            const storeCoordinates = await geocodingApi.search(STORE_ADDRESS)
            if (storeCoordinates) {
                distanceKm.value = calcularDistancia(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    Number(storeCoordinates.latitude),
                    Number(storeCoordinates.longitude)
                )
            }
        } catch (error) {
            console.error('Erro ao calcular distância:', error)
            distanceKm.value = null
        }
    }

    async function buscarLocalizacao() {
        const currentLocation = await requestCurrentLocation()
        if (!currentLocation) return
        try {
            const address = await geocodingApi.reverse(
                currentLocation.latitude,
                currentLocation.longitude
            )
            setLocationLabel(address.label)
            await calcularFretePorLocalizacao(currentLocation)
            enderecoManual.value = ''
        } catch (error) {
            console.error('Erro ao obter endereço:', error)
        }
    }

    async function buscarEnderecoManual() {
        const endereco = enderecoManual.value.trim()
        if (!endereco) return
        buscandoEndereco.value = true
        try {
            const resultado = await geocodingApi.search(endereco)
            if (!resultado) {
                alert('Não foi possível encontrar esse endereço. Confira os dados e tente novamente.')
                return
            }
            const latitude = Number(resultado.latitude)
            const longitude = Number(resultado.longitude)
            const enderecoEncontrado =
                resultado.display_name || resultado.label || endereco
            location.value = {
                latitude,
                longitude,
                label: enderecoEncontrado
            }
            setLocationLabel(enderecoEncontrado)
            await calcularFretePorLocalizacao({ latitude, longitude })
        } catch (error) {
            console.error('Erro ao buscar endereço:', error)
            alert('Não foi possível localizar esse endereço.')
        } finally {
            buscandoEndereco.value = false
        }
    }

    function selecionarEntrega(tipo) {
        tipoEntrega.value = tipo
        if (tipo === 'Vou buscar') {
            distanceKm.value = 0
        } else if (tipo === 'Uber Entregas' && location.value?.latitude) {
            calcularFretePorLocalizacao(location.value)
        }
    }

    function abrirWhatsApp() {
        const entrega = tipoEntrega.value || 'a combinar'
        const endereco =
            location.value?.label ||
            enderecoManual.value ||
            'não informado'
        const pagamento = metodoPagamento.value || 'a combinar'
        const mensagem = `Olá! Gostaria de combinar meu pedido na Lumena.

Forma de pagamento: ${pagamento}
Entrega: ${entrega}
Endereço: ${endereco}

Gostaria de combinar com você se vou buscar ou se será feita a entrega por Uber.`

        window.open(
            `https://wa.me/${WHATSAPP_VENDEDORA}?text=${encodeURIComponent(mensagem)}`,
            '_blank'
        )
    }

    return {
        location,
        loadingLocation,
        locationError,
        enderecoManual,
        buscandoEndereco,
        distanceKm,
        buscarLocalizacao,
        buscarEnderecoManual,
        selecionarEntrega,
        abrirWhatsApp
    }
}
