<script setup>
defineProps({
  label: String,
  variant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['click'])
</script>
<template>
  <button @click="emit('click')" :class="[
    'px-4 py-2 transition',
    variant === 'azul'
      ? 'bg-[#0C2645] text-white hover:shadow'
      : 'border border-[#0C2645] text-[#0C2645] hover:shadow-2xl'
  ]">
    {{ label }}
  </button>
</template>