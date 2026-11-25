<script setup>
import { useProductView } from '@/composables/useProductView'

import ProductSuccessMessage from '@/components/product/ProductSuccessMessage.vue'
import ProductImage from '@/components/product/ProductImage.vue'
import ProductPurchaseOptions from '@/components/product/ProductPurchaseOptions.vue'
import ProductDescription from '@/components/product/ProductDescription.vue'

const {
    productsStore,
    product,
    produtoVariacoes,
    selectedPreco,
    selecionadaPrecoFormatado,
    addToBagMessage,
    addToBagError,
    addingToBag,
    adicionarASacola,
    aromaId
} = useProductView()
</script>

<template>
    <ProductSuccessMessage :show="addToBagMessage" />

    <div class="pb-20 md:pt-10">
        <div v-if="productsStore.loading" class="px-6 mt-6 text-[#2C2828] font-semibold">
            Carregando...
        </div>

        <div v-else-if="productsStore.error" class="px-6 mt-6 text-[#2C2828] font-semibold">
            {{ productsStore.error }}
        </div>

        <div v-else class="lg:flex lg:gap-16 lg:m-20 m-5 grid-cols-2">
            <div class="lg:w-1/2">
                <ProductImage :product="product" />
            </div>

            <div class="lg:w-1/2">
                <ProductPurchaseOptions :variacoes="produtoVariacoes" :selected-preco="selectedPreco"
                    :preco-formatado="selecionadaPrecoFormatado" :adding-to-bag="addingToBag"
                    :add-to-bag-error="addToBagError" @select="selectedPreco = $event" @add="adicionarASacola" />

                <ProductDescription :product="product" :aroma-id="aromaId" />
            </div>
        </div>
    </div>
</template>
