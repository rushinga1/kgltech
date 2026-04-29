<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
    :class="
      variant === 'brand'
        ? 'bg-brand-yellow/20 text-brand-green'
        : 'bg-slate-100 text-slate-600'
    "
  >
    <slot />
  </span>
</template>
