<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const panel = ref(null);

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const isOpen = computed(() => props.modelValue);

function close() {
  emit('update:modelValue', false);
}

function handleKeydown(event) {
  if (!isOpen.value) {
    return;
  }

  if (event.key === 'Escape') {
    close();
    return;
  }

  if (event.key !== 'Tab' || !panel.value) {
    return;
  }

  const items = Array.from(panel.value.querySelectorAll(focusableSelector));
  if (!items.length) {
    return;
  }

  const first = items[0];
  const last = items[items.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onClickOutside(panel, () => {
  if (isOpen.value) {
    close();
  }
});

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div ref="panel" class="panel w-full max-w-lg p-6">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
          <button
            type="button"
            aria-label="Close dialog"
            class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600"
            @click="close"
          >
            Close
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Transition>
</template>
