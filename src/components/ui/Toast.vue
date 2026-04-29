<script setup>
const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['dismiss']);

const toneMap = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
};
</script>

<template>
  <div
    class="flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-soft"
    :class="toneMap[props.toast.type] || toneMap.info"
    role="status"
    aria-live="polite"
  >
    <p class="text-sm font-medium">{{ props.toast.message }}</p>
    <button
      type="button"
      class="text-xs font-semibold uppercase tracking-wide"
      aria-label="Dismiss notification"
      @click="emit('dismiss', props.toast.id)"
    >
      Close
    </button>
  </div>
</template>
