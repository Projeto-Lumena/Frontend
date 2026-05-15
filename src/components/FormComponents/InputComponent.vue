<script setup>
const { campo } = defineProps({
  campo: Object
})

const emit = defineEmits(['update'])

const updateValue = (value) => {
  emit('update', value)
}
</script>

<template>
  <div class="flex flex-col gap-1 my-5 w-80%">

    <label class="text-sm text-[#2C2828]"> {{ campo.label }}</label>

    <input
      :type="campo.type"
      :placeholder="campo.placeholder"
      :value="campo.value"
      @input="updateValue($event.target.value)"
      class="border border-gray-300 px-3 py-2 "
    />

  </div>
</template>