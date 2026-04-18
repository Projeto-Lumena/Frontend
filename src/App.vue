<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
import OfflineBanner from './components/OfflineBanner.vue'
import UpdatePrompt from './components/UpdatePrompt.vue';
</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <RouterView />
        <UpdatePrompt />
    </main>
    
    <footer>
        <OfflineBanner />
        <AppFooter />
    </footer>
</template>
