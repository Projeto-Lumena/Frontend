<script setup>
const { campo } = defineProps({
  campo: Object
})

const emit = defineEmits(['update'])

const updateValue = (value) => {
  // Limpa o erro ao começar a digitar novamente
  campo.error = ''

  emit('update', value)
}
</script>

<template>
  <div class="flex flex-col gap-1 my-5 w-[100%]">

    <label class="text-sm text-[#2C2828]">
      {{ campo.label }}
    </label>

    <input
      :type="campo.type"
      :placeholder="campo.placeholder"
      :value="campo.value"
      @input="updateValue($event.target.value)"
      :class="[
        'px-3 py-2 rounded border transition-colors duration-200',
        campo.error
          ? 'border-red-500 focus:border-red-500 focus:outline-none'
          : 'border-gray-300 focus:border-[#0C2645] focus:outline-none'
      ]"
    />

    <p
      v-if="campo.error"
      class="text-sm text-red-500"
    >
      {{ campo.error }}
    </p>

  </div>
</template>