<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <RouterView />
    </main>
    <footer>
        <div class="min-h-screen flex flex-col">
            <RouterView class="flex-1" />
            <AppFooter />
        </div>
    </footer>
</template>
