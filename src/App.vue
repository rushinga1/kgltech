<script setup>
import { RouterView } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import ToastViewport from './components/ui/ToastViewport.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <main class="min-h-[calc(100vh-220px)] pt-20">
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
