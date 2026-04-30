<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../components/ui/Button.vue';
import { useAuth } from '../composables/useAuth';
import { useCart } from '../composables/useCart';

const { orders } = useAuth();
const { formatRwf } = useCart();

const latestOrder = computed(() => orders.value[0] || null);
</script>

<template>
  <section class="page-shell py-20">
    <div class="mx-auto max-w-2xl panel p-12 text-center dark:bg-slate-900">
      <div class="flex justify-center">
        <div class="rounded-full bg-brand-green/10 p-5">
           <svg class="h-16 w-16 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
             <polyline points="20 6 9 17 4 12"></polyline>
           </svg>
        </div>
      </div>
      
      <h1 class="mt-8 text-4xl font-black text-slate-900 dark:text-white leading-tight">Murakoze! <br/> Your order is confirmed.</h1>
      <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">Estimated delivery: 5 to 7 business days.</p>

      <div v-if="latestOrder" class="mt-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 p-8 text-left border border-slate-100 dark:border-white/5">
        <div class="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference ID</p>
            <p class="mt-1 text-lg font-black text-slate-900 dark:text-white">{{ latestOrder.id }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</p>
            <p class="mt-1 text-2xl font-black text-brand-green">{{ formatRwf(latestOrder.total) }}</p>
          </div>
        </div>
        <div class="mt-6 border-t border-slate-200 dark:border-white/10 pt-6">
          <ul class="space-y-3">
            <li v-for="item in latestOrder.items" :key="item.id" class="flex justify-between text-sm">
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ item.title }} <span class="text-slate-400">x{{ item.qty }}</span></span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap justify-center gap-5">
        <RouterLink to="/products"><Button size="lg" class="px-8 shadow-xl shadow-brand-blue/20">Keep Shopping</Button></RouterLink>
        <RouterLink to="/profile/orders"><Button variant="outline" size="lg" class="px-8 dark:text-white dark:border-white/10">Track Orders</Button></RouterLink>
      </div>
    </div>
  </section>
</template>
