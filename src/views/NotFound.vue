<script setup>
import { useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue';

const router = useRouter();
</script>

<template>
  <section class="page-shell flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
    <p class="text-7xl font-black text-brand-blue">404</p>
    <h1 class="mt-4 text-3xl font-black text-slate-900">Page not found</h1>
    <p class="mt-3 max-w-md text-sm text-slate-500">
      The page you are looking for may have moved. Head back or continue shopping from home.
    </p>
    <div class="mt-8 flex gap-4">
      <Button variant="outline" @click="router.back()">Go Back</Button>
      <RouterLink to="/"><Button>Home</Button></RouterLink>
    </div>
  </section>
</template>
