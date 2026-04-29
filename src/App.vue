<script setup>
import { RouterView } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import ToastViewport from './components/ui/ToastViewport.vue';
import { useTheme } from './composables/useTheme';

useTheme();
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <Header />
    <main class="min-h-[calc(100vh-220px)] pt-28">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <Footer />
    <ToastViewport />
  </div>
</template>
