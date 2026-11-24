<template>
  <button class="install-button" @click="$emit('install')">
    <span class="install-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
    </span>

    <span class="install-text">
      <strong>Instalar aplicativo Lumena</strong>
      <small>Tenha nossos aromas sempre por perto</small>
    </span>

    <span class="install-arrow">→</span>
  </button>
</template>

<script setup>
defineEmits(['install']);
</script>

<style scoped>
.install-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: fit-content;
  max-width: calc(100% - 32px);
  margin: 24px auto;
  padding: 13px 25px;
  background-color: #0C2645;
  color: #F8F9F9;
  border: 1px solid #C9A85D;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 4px 12px rgba(12, 38, 69, 0.12);
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.install-button:hover {
  background-color: #173957;
  box-shadow: 0 6px 16px rgba(12, 38, 69, 0.2);
  transform: translateY(-2px);
}

.install-button:focus-visible {
  outline: 2px solid #C9A85D;
  outline-offset: 4px;
}

.install-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E4C77E;
}

.install-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.install-text strong {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.install-text small {
  font-size: 11px;
  color: #D0D9E2;
}

.install-arrow {
  margin-left: 5px;
  color: #E4C77E;
  font-size: 21px;
  transition: transform 0.25s ease;
}

.install-button:hover .install-arrow {
  transform: translateX(4px);
}

@media (max-width: 480px) {
  .install-button {
    gap: 10px;
    padding: 12px 16px;
  }

  .install-text strong {
    font-size: 12px;
  }

  .install-text small {
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {

  .install-button,
  .install-arrow {
    transition: none;
  }
}
</style>
