import { ref, onMounted } from 'vue'

export function useCandles() {
  const candles = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCandles = async () => {
    loading.value = true
    try {
      candles.value = [
        {
          id: 1,
          nome: 'Flor de Laranjeira',
          preco: 50.00,
          imagem: '/img/flor_laranjeira.svg'
        },
        {
          id: 2,
          nome: 'Capim Limão',
          preco: 50.00,
          imagem: '/img/capim_limão.svg'
        },
        {
          id: 3,
          nome: 'Lavanda Francesa',
          preco: 50.00,
          imagem: '/img/lavanda_francesa.svg'
        },
        {
          id: 4,
          nome: 'Jasmim',
          preco: 50.00,
          imagem: '/img/jasmim.svg'
        },
        {
          id: 5,
          nome: 'Flor de Cerejeira',
          preco: 50.00,
          imagem: '/img/flor_cerejeira.svg'
        },
        {
          id: 6,
          nome: 'Maçã e Canela',
          preco: 50.00,
          imagem: '/img/maca_canela.svg'
        },
        {
          id: 7,
          nome: 'Bergamota',
          preco: 50.00,
          imagem: '/img/bergamota.svg'
        },
        {
          id: 8,
          nome: 'Baunilha',
          preco: 50.00,
          imagem: '/img/baunilha.svg'
        }
      ]
    } catch (err) {
      error.value = 'Erro ao carregar velas'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCandles)

  return {
    candles,
    loading,
    error
  }
}