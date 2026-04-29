<script setup>
import { useAuth } from '../composables/useAuth';
import { useCart } from '../composables/useCart';

const { orders } = useAuth();
const { formatRwf } = useCart();
</script>

<template>
  <div class="panel p-6">
    <h2 class="text-xl font-bold text-slate-900">My Orders</h2>
    <div v-if="!orders.length" class="mt-5 rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
      No orders yet. Your completed checkout orders will appear here.
    </div>
    <div v-else class="mt-5 space-y-4">
      <article v-for="order in orders" :key="order.id" class="rounded-3xl border border-slate-200 p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Order ID</p>
            <p class="mt-1 font-semibold text-slate-900">{{ order.id }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Date</p>
            <p class="mt-1 font-semibold text-slate-900">{{ order.date }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p class="mt-1 font-semibold text-brand-green">{{ formatRwf(order.total) }}</p>
          </div>
        </div>
        <ul class="mt-4 space-y-2 text-sm text-slate-600">
          <li v-for="item in order.items" :key="item.id">
            {{ item.title }} x {{ item.qty }}
          </li>
        </ul>
      </article>
    </div>
  </div>
</template>
