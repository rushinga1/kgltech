<script setup>
import { formatPriceRwf } from '../../composables/useProducts';

defineProps({
  price: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <span class="text-lg font-bold text-brand-green">{{ formatPriceRwf(price) }}</span>
</template>
