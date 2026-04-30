<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import Badge from '../components/ui/Badge.vue';
import Button from '../components/ui/Button.vue';
import Skeleton from '../components/ui/Skeleton.vue';
import ProductGallery from '../components/product/ProductGallery.vue';
import ProductCard from '../components/product/ProductCard.vue';
import PriceTag from '../components/product/PriceTag.vue';
import RatingStars from '../components/product/RatingStars.vue';
import { useCart } from '../composables/useCart';
import { useProducts } from '../composables/useProducts';
import { useToast } from '../composables/useToast';
import { useWishlist } from '../composables/useWishlist';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const product = ref(null);
const quantity = ref(1);
const relatedProducts = ref([]);

const { addItem } = useCart();
const { all, fetchAll, fetchOne, fetchByCategory } = useProducts();
const { toggleItem } = useWishlist();
const { success, info, error } = useToast();

const breadcrumbCategory = computed(() => product.value?.category || 'Category');
const galleryImages = computed(() =>
  product.value ? [product.value.image, product.value.image, product.value.image] : [],
);

async function loadProduct() {
  product.value = null;

  try {
    const nextProduct = await fetchOne(props.id);
    product.value = nextProduct;
    await fetchAll();
    const sameCategory = await fetchByCategory(nextProduct.category);
    relatedProducts.value = sameCategory
      .filter((item) => item.id !== nextProduct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  } catch {
    error('Unable to load the product details.');
  }
}

function addToCart() {
  addItem(product.value, quantity.value);
  success('Item added to your cart.');
}

function addToWishlist() {
  const added = toggleItem(product.value);
  info(added ? 'Saved to wishlist.' : 'Removed from wishlist.');
}

watch(() => props.id, loadProduct, { immediate: true });
onMounted(() => {
  if (!all.value.length) {
    fetchAll().catch(() => {});
  }
});
</script>

<template>
  <div class="space-y-12">
    <div class="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
      <RouterLink to="/" class="hover:text-brand-blue">Home</RouterLink>
      <span class="mx-2 opacity-50"> / </span>
      <RouterLink to="/products" class="hover:text-brand-blue">Gallery</RouterLink>
      <span class="mx-2 opacity-50"> / </span>
      <span class="capitalize text-slate-400">{{ breadcrumbCategory }}</span>
      <span v-if="product" class="hidden sm:inline">
         <span class="mx-2 opacity-50"> / </span>
         <span class="truncate">{{ product.title }}</span>
      </span>
    </div>

    <div v-if="!product" class="grid gap-8 lg:grid-cols-2">
      <Skeleton class-name="h-[520px] w-full rounded-[3.5rem]" />
      <div class="space-y-6">
        <Skeleton class-name="h-6 w-32" />
        <Skeleton class-name="h-16 w-full" />
        <Skeleton class-name="h-8 w-40" />
        <Skeleton class-name="h-40 w-full" />
      </div>
    </div>

    <div v-else class="grid gap-12 lg:grid-cols-2">
      <ProductGallery :images="galleryImages" />

      <div class="flex flex-col justify-center">
        <Badge variant="brand" class="w-fit px-4 py-1.5 text-[10px] uppercase font-black tracking-widest">{{ product.category }}</Badge>
        <h1 class="mt-6 text-4xl font-black text-slate-900 dark:text-white leading-[1.1] md:text-5xl">{{ product.title }}</h1>
        <div class="mt-6 flex items-center gap-6">
          <PriceTag :price="product.price" class="scale-125 origin-left" />
          <div class="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
          <RatingStars :rate="product.rating?.rate || 0" :count="product.rating?.count || 0" />
        </div>
        <p class="mt-10 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {{ product.description }} This genuine {{ product.category }} item is hand-picked for quality and durability, making it a perfect choice for your tech lifestyle in Kigali.
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-5">
          <div class="flex items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2 py-2">
            <button type="button" class="flex h-10 w-10 items-center justify-center text-xl dark:text-white transition-opacity hover:opacity-50" aria-label="Decrease quantity" @click="quantity = Math.max(1, quantity - 1)">-</button>
            <span class="min-w-10 text-center font-black dark:text-white">{{ quantity }}</span>
            <button type="button" class="flex h-10 w-10 items-center justify-center text-xl dark:text-white transition-opacity hover:opacity-50" aria-label="Increase quantity" @click="quantity = Math.min(99, quantity + 1)">+</button>
          </div>
          <Button size="lg" class="px-10 h-14 rounded-2xl shadow-xl shadow-brand-blue/20" @click="addToCart">Add to Cart</Button>
          <Button variant="outline" size="lg" class="h-14 rounded-2xl border-slate-200 dark:border-white/10 dark:text-white" @click="addToWishlist">Favorite</Button>
        </div>
      </div>
    </div>

    <section>
      <div class="mb-10 flex items-center justify-between">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white">Related Pieces</h2>
        <RouterLink to="/products" class="text-sm font-black uppercase tracking-widest text-brand-green hover:underline">Explore all</RouterLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" />
      </div>
    </section>
  </div>
</template>
