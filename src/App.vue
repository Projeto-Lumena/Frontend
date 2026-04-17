<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
import OfflineBanner from './components/OfflineBanner.vue'
</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <RouterView />
    </main>
    <footer>
        <OfflineBanner />
        <AppFooter />
    </footer>
</template>
