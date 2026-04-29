<script setup>
import { computed } from 'vue';
import { Star } from 'lucide-vue-next';

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
    <div class="flex items-center gap-0.5 text-brand-gold">
      <Star 
        v-for="(filled, index) in stars" 
        :key="index" 
        :size="12" 
        :fill="filled ? 'currentColor' : 'transparent'" 
      />
    </div>
    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">{{ rate.toFixed(1) }} <span v-if="count">({{ count }})</span></span>
  </div>
</template>
