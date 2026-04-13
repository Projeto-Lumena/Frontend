<script setup>
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <router-view class="flex-1" />
        <AppFooter />
    </div>
</template>
