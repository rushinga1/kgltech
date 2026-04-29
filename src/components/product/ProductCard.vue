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
  <article class="panel panel-hover group flex h-full flex-col overflow-hidden p-6">
    <div class="relative mb-6 flex h-52 items-center justify-center rounded-[2rem] bg-slate-50 transition-colors group-hover:bg-brand-blue/5">
      <RouterLink :to="`/products/${product.id}`" class="flex h-full w-full items-center justify-center p-8">
        <img
          :src="product.image"
          :alt="product.title"
          class="h-full w-full max-w-[140px] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </RouterLink>
      <button
        type="button"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm backdrop-blur transition-all hover:bg-brand-gold/20"
        :aria-label="heartFilled ? 'Remove from wishlist' : 'Add to wishlist'"
        @click="toggleWishlist"
      >
        <span :class="heartFilled ? 'text-brand-gold scale-110' : 'text-slate-400 opacity-60'">
          {{ heartFilled ? '★' : '☆' }}
        </span>
      </button>
    </div>

    <div class="flex flex-1 flex-col">
      <div class="mb-3 flex items-center justify-between gap-3">
        <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {{ product.category }}
        </span>
        <RatingStars :rate="product.rating?.rate || 0" :count="product.rating?.count || 0" />
      </div>

      <RouterLink
        :to="`/products/${product.id}`"
        class="line-clamp-2 text-lg font-black leading-tight text-slate-900 group-hover:text-brand-blue transition-colors"
      >
        {{ product.title }}
      </RouterLink>

      <div class="mt-8 flex items-center justify-between gap-4">
        <PriceTag :price="product.price" class="scale-110 origin-left" />
        <Button class="rounded-2xl px-5 h-11 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand-blue/10" aria-label="Add product to cart" size="sm" @click="addToCart">
          Buy Now
        </Button>
      </div>
    </div>
  </article>
</template>
