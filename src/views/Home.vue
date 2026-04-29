<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
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
  electronics: '💻',
  jewelery: '⌚',
  "men's clothing": '🎧',
  "women's clothing": '📱',
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
  <div class="space-y-20 pb-10">
    <section ref="heroTarget" class="page-shell pt-10">
      <div
        class="grid items-center gap-8 rounded-[2rem] bg-slate-950 px-8 py-16 text-white lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div :class="heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'" class="transition duration-700">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-yellow">Kigali Tech Store</p>
          <h1 class="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Shop the Latest Tech in Kigali
          </h1>
          <p class="mt-5 max-w-xl text-base text-slate-300">
            Discover modern gadgets, trusted accessories, and everyday electronics tailored for
            life and work in Rwanda's vibrant capital.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink to="/products"><Button size="lg">Browse Products</Button></RouterLink>
            <RouterLink to="/wishlist"><Button size="lg" variant="outline">Saved Picks</Button></RouterLink>
          </div>
        </div>
        <div class="panel animate-float p-8">
          <div class="grid gap-4 text-slate-900">
            <div class="rounded-3xl bg-brand-blue/10 p-4">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Fast Delivery</p>
              <p class="mt-2 text-lg font-bold">5 to 7 business days across Kigali</p>
            </div>
            <div class="rounded-3xl bg-brand-yellow/15 p-4">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">Trusted Pricing</p>
              <p class="mt-2 text-lg font-bold">Clear RWF totals with VAT included</p>
            </div>
            <div class="rounded-3xl bg-brand-green/10 p-4">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">Curated Gear</p>
              <p class="mt-2 text-lg font-bold">Smart finds for creators, students, and businesses</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-shell">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Featured</p>
          <h2 class="mt-2 text-3xl font-black text-slate-900">Trending tech picks</h2>
        </div>
        <RouterLink to="/products" class="text-sm font-semibold text-brand-green">View all</RouterLink>
      </div>
      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton v-for="index in 8" :key="index" class-name="h-80 w-full rounded-[2rem]" />
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in featuredList" :key="product.id" :product="product" />
      </div>
    </section>

    <section class="page-shell">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Categories</p>
      <h2 class="mt-2 text-3xl font-black text-slate-900">Explore by collection</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="category in categories"
          :key="category"
          :to="{ path: '/products', query: { category } }"
          class="panel flex items-center gap-4 p-5 transition hover:-translate-y-1"
        >
          <span class="text-3xl">{{ categoryIcons[category] || '🛍️' }}</span>
          <div>
            <p class="font-semibold capitalize text-slate-900">{{ category }}</p>
            <p class="text-sm text-slate-500">Shop for Kigali</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="page-shell">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Testimonials</p>
      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <article v-for="testimonial in testimonials" :key="testimonial.name" class="panel p-6">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">
              {{ testimonial.name.slice(0, 1) }}
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ testimonial.name }}</p>
              <p class="text-sm text-slate-500">{{ testimonial.location }}, Kigali</p>
            </div>
          </div>
          <p class="mt-4 text-brand-gold">{{ '★'.repeat(testimonial.rating) }}</p>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ testimonial.text }}</p>
        </article>
      </div>
    </section>

    <section class="page-shell">
      <div class="panel grid gap-6 px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-green">Newsletter</p>
          <h2 class="mt-2 text-3xl font-black text-slate-900">Get store updates and product drops</h2>
          <p class="mt-3 text-sm text-slate-500">
            Sign up for new arrivals, bundle offers, and special Kigali-only promotions.
          </p>
        </div>
        <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="email = ''">
          <input
            v-model="email"
            type="email"
            class="rounded-full border border-slate-200 px-5 py-3"
            placeholder="you@example.com"
            aria-label="Email address"
          />
          <Button type="submit" variant="accent">Subscribe</Button>
        </form>
      </div>
    </section>
  </div>
</template>
