<script setup>
import { RouterLink, useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue';
import { useAuth } from '../composables/useAuth';
import { useCart } from '../composables/useCart';

const router = useRouter();
const { isAuthenticated } = useAuth();
const { items, isEmpty, shipping, tax, grandTotal, removeItem, updateQty, formatRwfFromUsd, formatRwf } =
  useCart();

function proceedToCheckout() {
  router.push(isAuthenticated.value ? '/checkout' : '/login?redirect=/checkout');
}
</script>

<template>
  <section class="page-shell py-10">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Cart</p>
      <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-white">Your Kigali Tech Store cart</h1>
    </div>

    <div
      v-if="isEmpty"
      class="panel flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-white/5 text-4xl mb-6">🛒</div>
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Your cart is empty</h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse products and add your next gadget.</p>
      <RouterLink to="/products" class="mt-8"><Button size="lg">Explore Collection</Button></RouterLink>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <TransitionGroup name="fade" tag="div" class="space-y-4">
        <article v-for="item in items" :key="item.id" class="panel flex flex-col gap-6 p-6 md:flex-row md:items-center dark:bg-slate-900">
          <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-3">
            <img :src="item.image" :alt="item.title" class="h-full w-full object-contain" loading="lazy" />
          </div>
          <div class="flex-1">
            <h2 class="font-black text-slate-900 dark:text-white leading-tight">{{ item.title }}</h2>
            <p class="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400 capitalize">{{ item.category }}</p>
            <p class="mt-3 text-sm font-black text-brand-green">{{ formatRwfFromUsd(item.price) }}</p>
          </div>
          <div class="flex items-center gap-4 rounded-2xl bg-slate-100 dark:bg-white/5 p-2">
            <button type="button" class="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-sm font-black shadow-sm" aria-label="Decrease quantity" @click="updateQty(item.id, item.qty - 1)">-</button>
            <span class="font-black w-4 text-center dark:text-white">{{ item.qty }}</span>
            <button type="button" class="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-sm font-black shadow-sm" aria-label="Increase quantity" @click="updateQty(item.id, item.qty + 1)">+</button>
          </div>
          <div class="text-right min-w-[120px]">
            <p class="text-lg font-black text-slate-900 dark:text-white">{{ formatRwf(item.price * item.qty * 1300) }}</p>
            <button type="button" class="mt-1 text-xs font-bold text-red-500 hover:underline" @click="removeItem(item.id)">Remove</button>
          </div>
        </article>
      </TransitionGroup>

      <aside class="panel h-fit p-8 dark:bg-slate-900">
        <h2 class="text-xl font-black text-slate-900 dark:text-white">Order Summary</h2>
        <div class="mt-8 space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(grandTotal - shipping - tax) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(shipping) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>VAT (18%)</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(tax) }}</span>
          </div>
        </div>
        <div class="mt-8 border-t border-slate-200 dark:border-white/10 pt-6">
          <div class="flex items-center justify-between text-2xl font-black text-slate-900 dark:text-white">
            <span>Total</span>
            <span class="text-brand-green">{{ formatRwf(grandTotal) }}</span>
          </div>
        </div>
        <Button size="lg" class="mt-8 w-full shadow-lg shadow-brand-blue/10" @click="proceedToCheckout">Checkout RWF</Button>
      </aside>
    </div>
  </section>
</template>
