<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
    <AppHeader />
    <div class="min-h-screen flex flex-col">
    <HomeView />
        <router-view class="flex-1" />
        <footer>
            <AppFooter />
        </footer>
    </div>
</template>
