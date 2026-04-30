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
  <section class="page-shell py-12">
    <div class="mx-auto max-w-3xl panel p-8 text-center">
      <svg class="mx-auto h-24 w-24 text-brand-green" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="25" stroke="currentColor" stroke-width="2" />
        <path d="M14 27L22 35L38 18" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h1 class="mt-6 text-3xl font-black text-slate-900">Murakoze! Your order has been placed.</h1>
      <p class="mt-3 text-sm text-slate-500">Estimated delivery: 5 to 7 business days.</p>

      <div v-if="latestOrder" class="mt-8 rounded-3xl bg-slate-50 p-6 text-left">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Order</p>
            <p class="mt-1 font-semibold text-slate-900">{{ latestOrder.id }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p class="mt-1 font-semibold text-brand-green">{{ formatRwf(latestOrder.total) }}</p>
          </div>
        </div>
        <ul class="mt-5 space-y-2 text-sm text-slate-600">
          <li v-for="item in latestOrder.items" :key="item.id">{{ item.title }} x {{ item.qty }}</li>
        </ul>
      </div>

      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <RouterLink to="/products"><Button>Continue Shopping</Button></RouterLink>
        <RouterLink to="/profile/orders"><Button variant="outline">View Orders</Button></RouterLink>
      </div>
    </div>
  </section>
</template>
