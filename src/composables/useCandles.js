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
          nome: 'Vela Aromática Flor de Laranjeira',
          preco: 50.00,
          imagem: '/img/vela1.jpg'
        },
        {
          id: 2,
          nome: 'Vela Aromática Capim Limão',
          preco: 50.00,
          imagem: '/img/vela2.jpg'
        },
        {
          id: 3,
          nome: 'Vela Aromática Lavanda Francesa',
          preco: 50.00,
          imagem: '/img/vela3.jpg'
        },
        {
          id: 4,
          nome: 'Vela Aromática Jasmim',
          preco: 50.00,
          imagem: '/img/vela4.jpg'
        },
        {
          id: 5,
          nome: 'Vela Aromática Flor de Cerejeira',
          preco: 50.00,
          imagem: '/img/vela5.jpg'
        },
        {
          id: 6,
          nome: 'Vela Aromática Maçã e Canela',
          preco: 50.00,
          imagem: '/img/vela6.jpg'
        },
        {
          id: 7,
          nome: 'Vela Aromática Bergamota',
          preco: 50.00,
          imagem: '/img/vela7.jpg'
        },
        {
          id: 8,
          nome: 'Vela Aromática Baunilha',
          preco: 50.00,
          imagem: '/img/vela8.jpg'
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