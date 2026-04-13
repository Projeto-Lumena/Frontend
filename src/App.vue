<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <AppHeader />
    <div class="min-h-screen flex flex-col">
        <router-view class="flex-1" />
        <AppFooter />
    </div>
</template>
