<script setup>
import { useOnlineStatus } from '@/composables/useOnlineStatus';

const { isOnline } = useOnlineStatus();
</script>
<template>
  <div v-if="!isOnline" class="fixed left-0 w-full z-60 bg-[#e74c3c] text-white text-center p-3">
    Você está offline. Algumas funcionalidades podem estar indisponíveis.
  </div>
</template>
