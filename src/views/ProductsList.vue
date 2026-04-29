<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '../components/layout/Sidebar.vue';
import ProductCard from '../components/product/ProductCard.vue';
import Button from '../components/ui/Button.vue';
import Skeleton from '../components/ui/Skeleton.vue';
import { useProducts } from '../composables/useProducts';

const route = useRoute();
const router = useRouter();
const { all, categories, loading, error, fetchAll, setCategory, setSearch } = useProducts();

const filters = reactive({
  category: '',
  sort: 'popularity',
  rating: 0,
  minPrice: 0,
  maxPrice: 1000,
  search: '',
});

function syncFiltersFromRoute() {
  filters.category = route.query.category || '';
  filters.sort = route.query.sort || 'popularity';
  filters.rating = Number(route.query.rating || 0);
  filters.minPrice = Number(route.query.minPrice || 0);
  filters.maxPrice = Number(route.query.maxPrice || 1000);
  filters.search = route.query.search || '';
  setCategory(filters.category);
  setSearch(filters.search);
}

const filteredProducts = computed(() => {
  let items = [...all.value];

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
    );
  }
  items = items.filter(
    (item) =>
      item.price >= filters.minPrice &&
      item.price <= filters.maxPrice &&
      (filters.rating ? item.rating?.rate >= filters.rating : true),
  );

  if (filters.sort === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  } else {
    items.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
  }

  return items;
});

function updateQuery() {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.sort !== 'popularity') query.sort = filters.sort;
  if (filters.rating) query.rating = String(filters.rating);
  if (filters.minPrice) query.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== 1000) query.maxPrice = String(filters.maxPrice);
  if (filters.search) query.search = filters.search;

  router.replace({ query });
}

watch(() => route.query, syncFiltersFromRoute, { immediate: true });
watch(filters, updateQuery, { deep: true });

onMounted(() => {
  fetchAll().catch(() => {});
});
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
    <Sidebar>
      <div class="space-y-6">
        <div>
          <p class="text-sm font-semibold text-slate-900">Category</p>
          <div class="mt-3 space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <input v-model="filters.category" type="radio" value="" />
              All
            </label>
            <label v-for="category in categories" :key="category" class="flex items-center gap-2 text-sm capitalize">
              <input v-model="filters.category" type="radio" :value="category" />
              {{ category }}
            </label>
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Price Range (USD source)</p>
          <div class="mt-3 space-y-3">
            <input v-model="filters.minPrice" type="range" min="0" max="1000" step="10" class="w-full" />
            <input v-model="filters.maxPrice" type="range" min="0" max="1000" step="10" class="w-full" />
            <p class="text-xs text-slate-500">Min {{ filters.minPrice }} - Max {{ filters.maxPrice }}</p>
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Minimum Rating</p>
          <select v-model="filters.rating" class="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option :value="0">All ratings</option>
            <option :value="3">3 stars+</option>
            <option :value="4">4 stars+</option>
          </select>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Sort</p>
          <select v-model="filters.sort" class="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </Sidebar>

    <div>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Collection</p>
          <h2 class="mt-2 text-2xl font-black text-slate-900">Browse gadgets and electronics</h2>
        </div>
        <p class="text-sm text-slate-500">{{ filteredProducts.length }} items</p>
      </div>

      <div v-if="error" class="panel p-8 text-center">
        <p class="text-lg font-semibold text-slate-900">{{ error }}</p>
        <Button class="mt-4" @click="fetchAll(true)">Retry</Button>
      </div>

      <div v-else-if="loading" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton v-for="index in 6" :key="index" class-name="h-80 w-full rounded-[2rem]" />
      </div>

      <div
        v-else-if="!filteredProducts.length"
        class="panel flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div class="text-6xl">📦</div>
        <h3 class="mt-4 text-2xl font-bold text-slate-900">No products match your filters</h3>
        <p class="mt-2 max-w-md text-sm text-slate-500">
          Try widening the price range or browsing another Kigali Tech Store category.
        </p>
      </div>

      <RecycleScroller
        v-else-if="filteredProducts.length > 50"
        :items="filteredProducts"
        :item-size="360"
        key-field="id"
        class="h-[800px]"
      >
        <template #default="{ item }">
          <div class="mb-6">
            <ProductCard :product="item" />
          </div>
        </template>
      </RecycleScroller>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>
