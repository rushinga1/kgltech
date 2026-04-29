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
      <h1 class="mt-2 text-3xl font-black text-slate-900">Your Kigali Tech Store cart</h1>
    </div>

    <div
      v-if="isEmpty"
      class="panel flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div class="text-6xl">🛒</div>
      <h2 class="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h2>
      <p class="mt-2 text-sm text-slate-500">Browse products and add your next gadget.</p>
      <RouterLink to="/products" class="mt-6"><Button>Shop products</Button></RouterLink>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <TransitionGroup name="fade" tag="div" class="space-y-4">
        <article v-for="item in items" :key="item.id" class="panel flex flex-col gap-4 p-5 md:flex-row md:items-center">
          <img :src="item.image" :alt="item.title" class="h-24 w-24 rounded-2xl object-contain" loading="lazy" />
          <div class="flex-1">
            <h2 class="font-semibold text-slate-900">{{ item.title }}</h2>
            <p class="mt-1 text-sm text-slate-500 capitalize">{{ item.category }}</p>
            <p class="mt-2 text-sm font-semibold text-brand-green">{{ formatRwfFromUsd(item.price) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" class="rounded-full bg-slate-100 px-3 py-1" aria-label="Decrease quantity" @click="updateQty(item.id, item.qty - 1)">-</button>
            <span class="font-semibold">{{ item.qty }}</span>
            <button type="button" class="rounded-full bg-slate-100 px-3 py-1" aria-label="Increase quantity" @click="updateQty(item.id, item.qty + 1)">+</button>
          </div>
          <div class="text-right">
            <p class="font-semibold text-slate-900">{{ formatRwf(item.price * item.qty * 1300) }}</p>
            <button type="button" class="mt-2 text-sm font-semibold text-red-500" @click="removeItem(item.id)">Remove</button>
          </div>
        </article>
      </TransitionGroup>

      <aside class="panel h-fit p-6">
        <h2 class="text-xl font-bold text-slate-900">Order Summary</h2>
        <div class="mt-6 space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{{ formatRwf(grandTotal - shipping - tax) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping</span>
            <span>{{ formatRwf(shipping) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>VAT (18%)</span>
            <span>{{ formatRwf(tax) }}</span>
          </div>
        </div>
        <div class="mt-6 border-t border-slate-200 pt-4">
          <div class="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{{ formatRwf(grandTotal) }}</span>
          </div>
        </div>
        <Button class="mt-6 w-full" @click="proceedToCheckout">Proceed to Checkout</Button>
      </aside>
    </div>
  </section>
</template>
