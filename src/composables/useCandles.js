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
          tamanho: 'P',
          preco: 30.00,
          categoria: ['florais', 'citricos', 'lembrancinhas'],
          imagem: '/img/flor_laranjeira.svg'
        },
        {
          id: 2,
          nome: 'Flor de Laranjeira',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['florais', 'citricos', 'lembrancinhas'],
          imagem: '/img/flor_laranjeira.svg'
        },
        {
          id: 3,
          nome: 'Flor de Laranjeira',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['florais', 'citricos', 'lembrancinhas'],
          imagem: '/img/flor_laranjeira.svg'
        },
        {
          id: 4,
          nome: 'Capim Limão',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/capim_limão.svg'
        },
        {
          id: 5,
          nome: 'Capim Limão',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/capim_limão.svg'
        },
        {
          id: 6,
          nome: 'Capim Limão',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/capim_limão.svg'
        },
        {
          id: 7,
          nome: 'Lavanda Francesa',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/lavanda_francesa.svg'
        },
        {
          id: 8,
          nome: 'Lavanda Francesa',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/lavanda_francesa.svg'
        },
        {
          id: 9,
          nome: 'Lavanda Francesa',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/lavanda_francesa.svg'
        },
        {
          id: 10,
          nome: 'Jasmim',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/jasmim.svg'
        },
        {
          id: 11,
          nome: 'Jasmim',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/jasmim.svg'
        },
        {
          id: 12,
          nome: 'Jasmim',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['florais', 'lembrancinhas'],
          imagem: '/img/jasmim.svg'
        },
        {
          id: 13,
          nome: 'Flor de Cerejeira',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['florais', 'doces', 'lembrancinhas'],
          imagem: '/img/flor_cerejeira.svg'
        },
        {
          id: 14,
          nome: 'Flor de Cerejeira',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['florais', 'doces', 'lembrancinhas'],
          imagem: '/img/flor_cerejeira.svg'
        },
        {
          id: 15,
          nome: 'Flor de Cerejeira',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['florais', 'doces', 'lembrancinhas'],
          imagem: '/img/flor_cerejeira.svg'
        },
        {
          id: 16,
          nome: 'Maçã e Canela',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['doces', 'lembrancinhas'],
          imagem: '/img/maca_canela.svg'
        },
        {
          id: 17,
          nome: 'Maçã e Canela',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['doces', 'lembrancinhas'],
          imagem: '/img/maca_canela.svg'
        },
        {
          id: 18,
          nome: 'Maçã e Canela',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['doces', 'lembrancinhas'],
          imagem: '/img/maca_canela.svg'
        },
        {
          id: 19,
          nome: 'Bergamota',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/bergamota.svg'
        },
        {
          id: 20,
          nome: 'Bergamota',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/bergamota.svg'
        },
        {
          id: 21,
          nome: 'Bergamota',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['citricos', 'lembrancinhas'],
          imagem: '/img/bergamota.svg'
        },
        {
          id: 22,
          nome: 'Baunilha',
          tamanho: 'P',
          preco: 30.00,
          categoria: ['doces', 'lembrancinhas'],
          imagem: '/img/baunilha.svg'
        },
        {
          id: 23,
          nome: 'Baunilha',
          tamanho: 'M',
          preco: 40.00,
          categoria: ['doces', 'lembrancinhas'],
          imagem: '/img/baunilha.svg'
        },
        {
          id: 24,
          nome: 'Baunilha',
          tamanho: 'G',
          preco: 50.00,
          categoria: ['doces', 'lembrancinhas'],
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