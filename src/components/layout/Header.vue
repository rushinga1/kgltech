<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useDebounceFn, useScroll } from '@vueuse/core';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-vue-next';
import Button from '../ui/Button.vue';
import Badge from '../ui/Badge.vue';
import MobileNav from './MobileNav.vue';
import { useCart } from '../../composables/useCart';
import { useWishlist } from '../../composables/useWishlist';
import { useAuth } from '../../composables/useAuth';
import { useProducts } from '../../composables/useProducts';
import { useTheme } from '../../composables/useTheme';

const router = useRouter();
const { itemCount } = useCart();
const { count } = useWishlist();
const { isAuthenticated } = useAuth();
const { categories, fetchAll } = useProducts();
const { isDark, toggleTheme } = useTheme();

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
      isScrolled 
        ? 'bg-slate-50/90 dark:bg-slate-900/90 py-3 shadow-premium backdrop-blur-xl' 
        : 'bg-white/70 dark:bg-slate-950/70 py-6 backdrop-blur-md',
    ]"
  >
    <div class="page-shell flex items-center justify-between gap-6">
      <div class="flex items-center gap-10">
        <RouterLink to="/" class="group flex items-center gap-1 text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
          <span class="text-brand-blue transition-transform group-hover:-translate-y-1">K</span>
          <span class="text-brand-yellow transition-transform delay-75 group-hover:-translate-y-1">T</span>
          <span class="text-brand-green transition-transform delay-150 group-hover:-translate-y-1">S</span>
        </RouterLink>

        <nav class="hidden items-center gap-8 text-[13px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 lg:flex">
          <RouterLink to="/" class="hover:text-brand-blue" active-class="text-brand-blue">Home</RouterLink>
          <div class="group relative py-2">
            <RouterLink to="/products" class="flex items-center gap-1 hover:text-brand-blue" active-class="text-brand-blue">
              Gallery
              <ChevronDown :size="14" class="opacity-40 group-hover:rotate-180 transition-transform" />
            </RouterLink>
            <div class="panel invisible absolute left-0 top-10 w-64 translate-y-2 p-6 opacity-0 shadow-premium transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ring-1 ring-slate-100 dark:ring-white/5 dark:bg-slate-900">
              <p class="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory</p>
              <div class="grid gap-3">
                <RouterLink
                  v-for="category in categories"
                  :key="category"
                  :to="{ path: '/products', query: { category } }"
                  class="rounded-xl px-4 py-2 font-bold capitalize text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-blue"
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
            class="w-full rounded-2xl border border-slate-200/60 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-900 dark:text-white transition-all focus:border-brand-blue/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-brand-blue/5"
            @input="submitSearch"
          />
          <Search :size="18" class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-slate-900 dark:text-white pointer-events-none" />
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-brand-yellow/10 transition-colors"
          >
            <Sun v-if="isDark" :size="20" class="text-brand-yellow" />
            <Moon v-else :size="20" class="text-slate-700" />
          </button>

          <RouterLink to="/wishlist" class="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-brand-gold/10 transition-colors">
            <Heart :size="20" class="text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            <Badge v-if="count" variant="brand" class="absolute -right-2 -top-2 animate-pulse-badge">{{ count }}</Badge>
          </RouterLink>

          <RouterLink to="/cart" class="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-brand-blue/10 transition-colors">
            <ShoppingCart :size="20" class="text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
            <Badge v-if="itemCount" variant="brand" class="absolute -right-2 -top-2" :class="cartBadgeClass">{{ itemCount }}</Badge>
          </RouterLink>

          <div class="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

          <RouterLink :to="isAuthenticated ? '/profile' : '/login'">
            <Button size="sm" :variant="isAuthenticated ? 'secondary' : 'default'" class="h-10 px-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-blue/5">
              <User :size="14" class="mr-2" />
              {{ isAuthenticated ? 'Account' : 'Join Store' }}
            </Button>
          </RouterLink>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
            @click="mobileOpen = true"
          >
            <Menu :size="20" />
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
