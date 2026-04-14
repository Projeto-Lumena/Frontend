<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <HomeView />
        <RouterView />
    </main>
    <footer>
        <div class="min-h-screen flex flex-col">
            <RouterView class="flex-1" />
            <AppFooter />
        </div>
    </footer>
</template>
