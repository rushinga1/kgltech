<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useDebounceFn, useScroll } from '@vueuse/core';
import Button from '../ui/Button.vue';
import Badge from '../ui/Badge.vue';
import MobileNav from './MobileNav.vue';
import { useCart } from '../../composables/useCart';
import { useWishlist } from '../../composables/useWishlist';
import { useAuth } from '../../composables/useAuth';
import { useProducts } from '../../composables/useProducts';

const router = useRouter();
const { itemCount } = useCart();
const { count } = useWishlist();
const { isAuthenticated } = useAuth();
const { categories, fetchAll } = useProducts();

const searchOpen = ref(false);
const mobileOpen = ref(false);
const searchTerm = ref('');
const scrolledTarget = ref(typeof window !== 'undefined' ? window : null);
const { y } = useScroll(scrolledTarget);

const isScrolled = computed(() => y.value > 10);
const cartBadgeClass = computed(() => (itemCount.value ? 'animate-pulse-badge' : ''));

const submitSearch = useDebounceFn(() => {
  router.push({
    path: '/products',
    query: searchTerm.value ? { search: searchTerm.value } : {},
  });
}, 300);

onMounted(() => {
  fetchAll().catch(() => {});
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-white/95 backdrop-blur"
    :class="isScrolled ? 'shadow-soft' : ''"
  >
    <div class="page-shell flex h-20 items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-black text-slate-900">
          <span class="text-brand-blue">K</span>
          <span class="text-brand-yellow">T</span>
          <span class="text-brand-green">S</span>
        </RouterLink>
        <nav class="hidden items-center gap-5 text-sm font-semibold text-slate-700 lg:flex">
          <RouterLink to="/">Home</RouterLink>
          <div class="group relative">
            <RouterLink to="/products">Products</RouterLink>
            <div class="panel invisible absolute left-0 top-8 w-72 p-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Categories</p>
              <div class="grid gap-2">
                <RouterLink
                  v-for="category in categories"
                  :key="category"
                  :to="{ path: '/products', query: { category } }"
                  class="rounded-2xl px-3 py-2 text-sm hover:bg-slate-100"
                >
                  {{ category }}
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="hidden items-center gap-3 lg:flex">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            aria-label="Toggle product search"
            @click="searchOpen = !searchOpen"
          >
            Search
          </button>
          <input
            v-if="searchOpen"
            v-model="searchTerm"
            type="search"
            placeholder="Search gadgets"
            class="w-56 rounded-full border border-slate-200 px-4 py-2 text-sm"
            aria-label="Search products"
            @input="submitSearch"
          />
        </div>

        <RouterLink to="/cart" class="relative text-sm font-semibold text-slate-700">
          Cart
          <Badge v-if="itemCount" variant="brand" :class="cartBadgeClass">{{ itemCount }}</Badge>
        </RouterLink>
        <RouterLink to="/wishlist" class="text-sm font-semibold text-slate-700">
          Wishlist ({{ count }})
        </RouterLink>
        <RouterLink :to="isAuthenticated ? '/profile' : '/login'">
          <Button size="sm" variant="secondary">{{ isAuthenticated ? 'Profile' : 'Login' }}</Button>
        </RouterLink>
      </div>

      <button
        type="button"
        class="rounded-full bg-slate-100 p-3 lg:hidden"
        aria-label="Open navigation menu"
        @click="mobileOpen = true"
      >
        ☰
      </button>
    </div>

    <MobileNav
      v-model="mobileOpen"
      :categories="categories"
      :is-authenticated="isAuthenticated"
    />
  </header>
</template>
