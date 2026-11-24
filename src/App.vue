<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import OfflineBanner from './components/OfflineBanner.vue'
import UpdatePrompt from './components/UpdatePrompt.vue'
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header>
            <AppHeader />
        </header>

        <main class="flex-1">
            <RouterView />
            <UpdatePrompt />
        </main>

        <footer>
            <OfflineBanner />
            <AppFooter />
        </footer>
    </div>
</template>