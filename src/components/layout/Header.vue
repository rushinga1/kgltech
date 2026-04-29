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
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="[
      isScrolled ? 'bg-white/80 py-3 shadow-premium backdrop-blur-xl' : 'bg-white/0 py-5',
    ]"
  >
    <div class="page-shell flex items-center justify-between gap-6">
      <div class="flex items-center gap-10">
        <RouterLink to="/" class="group flex items-center gap-1 text-2xl font-black text-slate-900 tracking-tighter">
          <span class="text-brand-blue transition-transform group-hover:-translate-y-1">K</span>
          <span class="text-brand-yellow transition-transform delay-75 group-hover:-translate-y-1">T</span>
          <span class="text-brand-green transition-transform delay-150 group-hover:-translate-y-1">S</span>
        </RouterLink>

        <nav class="hidden items-center gap-8 text-[13px] font-black uppercase tracking-[0.2em] text-slate-500 lg:flex">
          <RouterLink to="/" class="hover:text-brand-blue" active-class="text-brand-blue">Home</RouterLink>
          <div class="group relative py-2">
            <RouterLink to="/products" class="flex items-center gap-1 hover:text-brand-blue" active-class="text-brand-blue">
              Gallery
              <span class="text-[10px] opacity-40 group-hover:rotate-180 transition-transform">▼</span>
            </RouterLink>
            <div class="panel invisible absolute left-0 top-10 w-64 translate-y-2 p-6 opacity-0 shadow-premium transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ring-1 ring-slate-100">
              <p class="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory</p>
              <div class="grid gap-3">
                <RouterLink
                  v-for="category in categories"
                  :key="category"
                  :to="{ path: '/products', query: { category } }"
                  class="rounded-xl px-4 py-2 font-bold capitalize text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-blue"
                >
                  {{ category }}
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="flex flex-1 items-center justify-end gap-3 lg:gap-5">
        <!-- Modern Search -->
        <div class="relative hidden sm:block lg:flex-1 lg:max-w-[280px]">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Kigali gear..."
            class="w-full rounded-2xl border border-slate-200/60 bg-slate-100/50 px-5 py-2.5 text-sm font-medium transition-all focus:border-brand-blue/30 focus:bg-white focus:ring-4 focus:ring-brand-blue/5"
            @input="submitSearch"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 select-none">🔍</span>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <RouterLink to="/wishlist" class="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/50 hover:bg-brand-gold/10 transition-colors">
            <span class="text-lg group-hover:scale-110 transition-transform">★</span>
            <Badge v-if="count" variant="brand" class="absolute -right-2 -top-2 animate-pulse-badge">{{ count }}</Badge>
          </RouterLink>

          <RouterLink to="/cart" class="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/50 hover:bg-brand-blue/10 transition-colors">
            <span class="text-lg group-hover:scale-110 transition-transform">🛒</span>
            <Badge v-if="itemCount" variant="brand" class="absolute -right-2 -top-2" :class="cartBadgeClass">{{ itemCount }}</Badge>
          </RouterLink>

          <div class="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <RouterLink :to="isAuthenticated ? '/profile' : '/login'">
            <Button size="sm" :variant="isAuthenticated ? 'secondary' : 'default'" class="h-10 px-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-blue/5">
              {{ isAuthenticated ? 'Account' : 'Join Store' }}
            </Button>
          </RouterLink>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white lg:hidden"
            aria-label="Open navigation menu"
            @click="mobileOpen = true"
          >
            ☰
          </button>
        </div>
      </div>
    </div>

    <MobileNav
      v-model="mobileOpen"
      :categories="categories"
      :is-authenticated="isAuthenticated"
    />
  </header>
</template>
