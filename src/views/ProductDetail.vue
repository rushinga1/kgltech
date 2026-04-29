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
    <div class="text-sm text-slate-500">
      <RouterLink to="/">Home</RouterLink>
      <span> / </span>
      <RouterLink to="/products">Products</RouterLink>
      <span> / </span>
      <span class="capitalize">{{ breadcrumbCategory }}</span>
      <span v-if="product"> / {{ product.title }}</span>
    </div>

    <div v-if="!product" class="grid gap-8 lg:grid-cols-2">
      <Skeleton class-name="h-[460px] w-full rounded-[2rem]" />
      <div class="space-y-4">
        <Skeleton class-name="h-6 w-32" />
        <Skeleton class-name="h-10 w-full" />
        <Skeleton class-name="h-6 w-40" />
        <Skeleton class-name="h-32 w-full" />
      </div>
    </div>

    <div v-else class="grid gap-10 lg:grid-cols-2">
      <ProductGallery :images="galleryImages" />

      <div>
        <Badge variant="brand" class="capitalize">{{ product.category }}</Badge>
        <h1 class="mt-4 text-4xl font-black text-slate-900">{{ product.title }}</h1>
        <div class="mt-4 flex items-center gap-4">
          <PriceTag :price="product.price" />
          <RatingStars :rate="product.rating?.rate || 0" :count="product.rating?.count || 0" />
        </div>
        <p class="mt-6 leading-7 text-slate-600">
          {{ product.description }} Perfect for modern homes, startups, and creators across Kigali.
        </p>

        <div class="mt-8 flex items-center gap-4">
          <div class="flex items-center rounded-full border border-slate-200 bg-white px-2 py-2">
            <button type="button" class="px-3 py-1 text-lg" aria-label="Decrease quantity" @click="quantity = Math.max(1, quantity - 1)">-</button>
            <span class="min-w-10 text-center font-semibold">{{ quantity }}</span>
            <button type="button" class="px-3 py-1 text-lg" aria-label="Increase quantity" @click="quantity = Math.min(99, quantity + 1)">+</button>
          </div>
          <Button @click="addToCart">Add to Cart</Button>
          <Button variant="outline" @click="addToWishlist">Add to Wishlist</Button>
        </div>
      </div>
    </div>

    <section>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-black text-slate-900">Related Products</h2>
        <RouterLink to="/products" class="text-sm font-semibold text-brand-green">See more</RouterLink>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" />
      </div>
    </section>
  </div>
</template>
