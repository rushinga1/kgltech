<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../ui/Button.vue';
import RatingStars from './RatingStars.vue';
import PriceTag from './PriceTag.vue';
import { useCart } from '../../composables/useCart';
import { useToast } from '../../composables/useToast';
import { useWishlist } from '../../composables/useWishlist';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { addItem } = useCart();
const { toggleItem, isWishlisted } = useWishlist();
const { success, info } = useToast();

const heartFilled = computed(() => isWishlisted(props.product.id));

function addToCart() {
  addItem(props.product, 1);
  success(`${props.product.title} added to cart.`);
}

function toggleWishlist() {
  const added = toggleItem(props.product);
  info(added ? 'Added to wishlist.' : 'Removed from wishlist.');
}
</script>

<template>
  <article class="panel group flex h-full flex-col overflow-hidden p-4">
    <div class="mb-4 flex items-start justify-between gap-3">
      <RouterLink :to="`/products/${product.id}`" class="mx-auto flex h-44 items-center justify-center">
        <img
          :src="product.image"
          :alt="product.title"
          class="h-full w-full max-w-[170px] object-contain transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </RouterLink>
      <button
        type="button"
        class="rounded-full bg-slate-100 p-2 text-lg"
        :aria-label="heartFilled ? 'Remove from wishlist' : 'Add to wishlist'"
        @click="toggleWishlist"
      >
        {{ heartFilled ? '♥' : '♡' }}
      </button>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{{ product.category }}</p>
      <RouterLink
        :to="`/products/${product.id}`"
        class="line-clamp-2 text-base font-semibold text-slate-900"
      >
        {{ product.title }}
      </RouterLink>
      <RatingStars :rate="product.rating?.rate || 0" :count="product.rating?.count || 0" />
      <div class="mt-auto flex items-center justify-between gap-3">
        <PriceTag :price="product.price" />
        <Button aria-label="Add product to cart" size="sm" @click="addToCart">Add to Cart</Button>
      </div>
    </div>
  </article>
</template>
