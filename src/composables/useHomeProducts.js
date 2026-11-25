
import { ref, computed } from 'vue'

export function useHomeProducts(storeProducts) {
    const filtros = ref({
        ordenacao: '',
        colecoes: []
    })

    const categoriasMap = {
        1: 'florais',
        3: 'citricos',
        2: 'doces',
        4: 'lembrancinhas'
    }

    const aromasPorProduto = {
        'Bergamota': 'bergamota',
        'Capim Limão': 'capim-limao',
        'Flor de Laranjeira': 'flor-de-laranjeira',
        'Jasmim': 'jasmim',
        'Lavanda Francesa': 'lavanda-francesa',
        'Limão Siciliano': 'limao-siciliano',
        'Canela': 'canela',
        'Baunilha': 'baunilha',
        'Flor de Cerejeira': 'flor-de-cerejeira',
        'Maçã e Canela': 'maca-e-canela'
    }

    const precosMap = computed(() => {
        const mapa = {}

        storeProducts.productVariations.forEach(v => {
            if (!mapa[v.produto]) {
                mapa[v.produto] = []
            }

            mapa[v.produto].push(Number(v.preco))
        })

        return mapa
    })

    const productsAgrupadas = computed(() => {
        const mapa = {}

        storeProducts.products.forEach(produto => {
            const precos = precosMap.value[produto.id] || []

            if (!mapa[produto.nome]) {
                mapa[produto.nome] = {
                    id: produto.id,
                    nome: produto.nome,
                    imagem: produto.imagem,
                    categoriaIds: produto.categorias || [],
                    categoria: produto.categorias
                        ?.map(id => categoriasMap[id])
                        .filter(Boolean) || [],
                    precos: precos,
                    aroma: aromasPorProduto[produto.nome],
                    variacoes: storeProducts.productVariations.filter(
                        v => String(v.produto) === String(produto.id)
                    )
                }
            }
        })

        return Object.values(mapa).map(item => {
            const menor = item.precos.length
                ? Math.min(...item.precos)
                : 0

            const maior = item.precos.length
                ? Math.max(...item.precos)
                : 0

            return {
                ...item,
                precoMin: menor,
                precoMax: maior
            }
        })
    })

    const aplicarFiltros = async (dados) => {
        filtros.value = dados

        const parametros = {}

        const ordenacoes = {
            maior: '-preco_max',
            menor: 'preco_min',
            alfabetica: 'nome',
            decrescente: '-nome'
        }

        if (dados.ordenacao) {
            parametros.ordering = ordenacoes[dados.ordenacao]
        }

        if (dados.colecoes.length > 0) {
            parametros.categorias = dados.colecoes.join(',')
        }

        await storeProducts.fetchProducts(parametros)
    }

    const limparFiltros = async () => {
        filtros.value = {
            ordenacao: '',
            colecoes: []
        }

        await storeProducts.fetchProducts()
    }

    const productsFiltradas = computed(() => {
        return productsAgrupadas.value
    })

    return {
        filtros,
        productsFiltradas,
        aplicarFiltros,
        limparFiltros
    }
}
