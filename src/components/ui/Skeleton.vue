<script setup>
defineProps({
  className: {
    type: String,
    default: 'h-4 w-full',
  },
});
</script>

<template>
  <div :class="['animate-pulse rounded-2xl bg-slate-200', className]" />
</template>
