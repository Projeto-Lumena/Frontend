<template>
  <InstallButtonContent v-if="showInstallButton" @install="installApp" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import InstallButtonContent from './install/InstallButtonContent.vue';

const showInstallButton = ref(false);
let deferredPrompt = null;

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton.value = true;
  });

  window.addEventListener('appinstalled', () => {
    showInstallButton.value = false;
    deferredPrompt = null;
  });
});

async function installApp() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    showInstallButton.value = false;
  }

  deferredPrompt = null;
}
</script>
