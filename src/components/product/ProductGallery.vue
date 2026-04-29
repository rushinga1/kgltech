<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const activeImage = ref('');

watch(
  () => props.images,
  (value) => {
    activeImage.value = value[0] || '';
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-4">
    <div class="panel flex h-96 items-center justify-center p-6">
      <img
        :src="activeImage"
        alt="Selected product image"
        class="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
    <div class="flex gap-3">
      <button
        v-for="image in images"
        :key="image"
        type="button"
        class="panel h-20 w-20 overflow-hidden border-2 p-2"
        :class="activeImage === image ? 'border-brand-blue' : 'border-transparent'"
        aria-label="Select product image"
        @click="activeImage = image"
      >
        <img :src="image" alt="Product thumbnail" class="h-full w-full object-contain" loading="lazy" />
      </button>
    </div>
  </div>
</template>
