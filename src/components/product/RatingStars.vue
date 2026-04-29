<script setup>
import { computed } from 'vue';

const props = defineProps({
  rate: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const stars = computed(() =>
  Array.from({ length: 5 }, (_, index) => index < Math.round(props.rate)),
);
</script>

<template>
  <div class="flex items-center gap-2" :aria-label="`Rated ${rate} out of 5`">
    <div class="flex items-center gap-1 text-brand-gold">
      <span v-for="(filled, index) in stars" :key="index">{{ filled ? '★' : '☆' }}</span>
    </div>
    <span class="text-xs text-slate-500">{{ rate.toFixed(1) }} <span v-if="count">({{ count }})</span></span>
  </div>
</template>
