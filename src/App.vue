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
        <AppFooter />
    </footer>
</template>
