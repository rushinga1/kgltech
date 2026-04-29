<script setup>
import { RouterLink } from 'vue-router';
import Button from '../components/ui/Button.vue';
import { useCart } from '../composables/useCart';
import { useWishlist } from '../composables/useWishlist';

const { addItem } = useCart();
const { items, removeItem, formatPriceRwf } = useWishlist();

function moveToCart(item) {
  addItem(item, 1);
  removeItem(item.id);
}
</script>

<template>
  <section class="page-shell py-10">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Wishlist</p>
      <h1 class="mt-2 text-3xl font-black text-slate-900">Saved products</h1>
    </div>

    <div
      v-if="!items.length"
      class="panel flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div class="text-6xl">♡</div>
      <h2 class="mt-4 text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
      <RouterLink to="/products" class="mt-6"><Button>Explore products</Button></RouterLink>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in items" :key="item.id" class="panel p-5">
        <div class="flex items-start justify-between gap-4">
          <img :src="item.image" :alt="item.title" class="h-40 w-full object-contain" loading="lazy" />
          <button type="button" aria-label="Remove from wishlist" class="text-lg text-slate-500" @click="removeItem(item.id)">✕</button>
        </div>
        <h2 class="mt-4 line-clamp-2 font-semibold text-slate-900">{{ item.title }}</h2>
        <p class="mt-3 font-bold text-brand-green">{{ formatPriceRwf(item.price) }}</p>
        <Button class="mt-5 w-full" @click="moveToCart(item)">Move to Cart</Button>
      </article>
    </div>
  </section>
</template>
