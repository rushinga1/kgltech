<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { 
  Zap, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Star,
  Cpu,
  Monitor,
  Watch,
  Headphones,
  Smartphone
} from 'lucide-vue-next';
import Button from '../components/ui/Button.vue';
import ProductCard from '../components/product/ProductCard.vue';
import Skeleton from '../components/ui/Skeleton.vue';
import { useProducts } from '../composables/useProducts';

const testimonials = [
  { name: 'Aline M.', location: 'Kigali Heights', rating: 5, text: 'Fast delivery and genuine accessories for my home office.' },
  { name: 'Eric K.', location: 'Kimironko', rating: 5, text: 'The laptop bag and keyboard combo felt perfect for daily commuting in Kigali.' },
  { name: 'Diane U.', location: 'Remera', rating: 4, text: 'Simple checkout and great prices converted clearly into RWF.' },
];

const categoryIcons = {
  electronics: Cpu,
  jewelery: Watch,
  "men's clothing": Headphones,
  "women's clothing": Smartphone,
};

const heroTarget = ref(null);
const heroVisible = ref(false);
const email = ref('');

const { featuredProducts, categories, loading, fetchAll } = useProducts();

useIntersectionObserver(heroTarget, ([entry]) => {
  heroVisible.value = entry?.isIntersecting ?? false;
});

const featuredList = computed(() => featuredProducts.value);

onMounted(() => {
  fetchAll().catch(() => {});
});
</script>

<template>
  <div class="space-y-32 pb-20 dark:bg-slate-950">
    <!-- Hero Section -->
    <section ref="heroTarget" class="page-shell pt-10">
      <div
        class="relative overflow-hidden grid items-center gap-12 rounded-[3.5rem] bg-slate-950 px-10 py-20 text-white lg:grid-cols-[1.2fr_0.8fr]"
      >
        <!-- Background Gradient Blur -->
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-blue/20 blur-[120px]"></div>
        <div class="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-brand-green/10 blur-[120px]"></div>

        <div :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'" class="relative z-10 transition-all duration-1000 ease-out">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pl-2 pr-4 text-xs font-bold uppercase tracking-widest text-brand-yellow blur-none backdrop-blur-md">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[10px] text-slate-900">NEW</span>
            Kigali Tech Store
          </div>
          <h1 class="mt-8 text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
            The future of tech, <br />
            <span class="bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-green bg-clip-text text-transparent italic">right here in Kigali.</span>
          </h1>
          <p class="mt-8 max-w-xl text-lg leading-relaxed text-slate-400">
            Uncompromising quality. Trusted local delivery. We curate the world's best gadgets and accessories for Rwanda's rising tech scene.
          </p>
          <div class="mt-10 flex flex-wrap gap-5">
            <RouterLink to="/products"><Button size="lg" class="px-8 shadow-xl shadow-brand-blue/20">Discovery Gallery</Button></RouterLink>
            <RouterLink to="/wishlist"><Button size="lg" variant="outline" class="border-white/20 px-8 hover:bg-white/5">My Favorites</Button></RouterLink>
          </div>
        </div>

        <div class="relative z-10 animate-float">
          <div class="glass flex flex-col gap-6 rounded-[2.5rem] p-10">
            <div class="flex items-start gap-5">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/20 text-brand-blue">
                <Zap :size="24" />
              </div>
              <div>
                <p class="text-sm font-bold uppercase tracking-widest text-brand-blue">Swift Delivery</p>
                <p class="mt-1 text-xl font-bold dark:text-white">5-7 Business Days</p>
                <p class="text-sm text-slate-400">Doorstep delivery across Kigali province</p>
              </div>
            </div>
            <div class="h-px w-full bg-white/10"></div>
            <div class="flex items-start gap-5">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green/20 text-brand-green">
                <ShieldCheck :size="24" />
              </div>
              <div>
                <p class="text-sm font-bold uppercase tracking-widest text-brand-green">Global Brands</p>
                <p class="mt-1 text-xl font-bold dark:text-white">100% Genuine Gear</p>
                <p class="text-sm text-slate-400">Full warranty on every tech investment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Section -->
    <section class="page-shell">
      <div class="mb-12 flex items-end justify-between">
        <div>
          <span class="text-xs font-black uppercase tracking-[0.4em] text-brand-blue">Curated Selection</span>
          <h2 class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Trending Tech Picks</h2>
        </div>
        <RouterLink to="/products" class="group flex items-center gap-2 text-sm font-bold text-brand-green">
          View all collection
          <ArrowRight :size="16" class="transition-transform group-hover:translate-x-1" />
        </RouterLink>
      </div>
      <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton v-for="index in 4" :key="index" class-name="h-[400px] w-full rounded-[3rem]" />
      </div>
      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in featuredList" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- Categories -->
    <section class="page-shell">
      <div class="mb-12 text-center">
        <span class="text-xs font-black uppercase tracking-[0.4em] text-brand-green">Inventory</span>
        <h2 class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Explore Collections</h2>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="category in categories"
          :key="category"
          :to="{ path: '/products', query: { category } }"
          class="panel group relative flex flex-col items-center gap-6 p-10 text-center transition-all hover:border-brand-blue/30 lg:p-12 dark:hover:border-brand-blue/40"
        >
          <div class="absolute inset-0 z-0 origin-center scale-90 rounded-[2.5rem] bg-brand-blue/5 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:bg-brand-blue/10"></div>
          <div class="relative z-10 text-brand-blue transition-transform duration-500 group-hover:scale-110">
            <component :is="categoryIcons[category] || Globe" :size="48" />
          </div>
          <div class="relative z-10">
            <p class="text-xl font-black capitalize text-slate-900 dark:text-white">{{ category }}</p>
            <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Shop Premium</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="page-shell rounded-[4rem] bg-slate-100/50 dark:bg-slate-900/50 py-24">
      <div class="mb-16 px-6 text-center">
        <span class="text-xs font-black uppercase tracking-[0.4em] text-brand-yellow">Community Voice</span>
        <h2 class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Trusted by Kigali Techies</h2>
      </div>
      <div class="grid gap-8 lg:grid-cols-3">
        <article v-for="testimonial in testimonials" :key="testimonial.name" class="panel p-10 shadow-none ring-1 ring-slate-200/60 dark:ring-white/5">
          <div class="flex items-center gap-5">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-green text-xl font-black text-white shadow-lg shadow-brand-blue/20">
              {{ testimonial.name.slice(0, 1) }}
            </div>
            <div>
              <p class="font-black text-slate-900 dark:text-white">{{ testimonial.name }}</p>
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ testimonial.location }}</p>
            </div>
          </div>
          <p class="mt-6 flex gap-1 text-sm text-brand-gold">
            <Star v-for="i in 5" :key="i" :size="18" :fill="i <= testimonial.rating ? 'currentColor' : 'transparent'" />
          </p>
          <p class="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">"{{ testimonial.text }}"</p>
        </article>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="page-shell">
      <div class="relative overflow-hidden rounded-[3.5rem] bg-brand-green p-12 text-white lg:p-20">
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-[80px]"></div>
        <div class="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span class="text-xs font-black uppercase tracking-[0.4em] text-brand-yellow">Stay Ahead</span>
            <h2 class="mt-4 text-4xl font-black leading-tight tracking-tight lg:text-5xl">Join the internal circle.</h2>
            <p class="mt-6 max-w-md text-lg text-brand-yellow/70">
              Be the first to know about product drops in Rwanda, exclusive bundles, and tech events.
            </p>
          </div>
          <form class="flex flex-col gap-4 sm:flex-row" @submit.prevent="email = ''">
            <input
              v-model="email"
              type="email"
              class="w-full rounded-2xl border border-white/10 bg-white/10 px-6 py-5 text-white placeholder:text-white/40 focus:bg-white/20 focus:ring-4 focus:ring-white/10 sm:min-w-[300px]"
              placeholder="Enter your email"
              aria-label="Email address"
            />
            <Button type="submit" size="lg" class="bg-brand-yellow h-full text-slate-900 hover:bg-white">Update Me</Button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
