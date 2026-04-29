<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import Button from '../ui/Button.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const panel = ref(null);
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
      class="fixed inset-0 z-[65] bg-slate-950/60 lg:hidden"
      aria-label="Mobile navigation"
    >
      <div ref="panel" class="ml-auto flex h-full w-80 flex-col bg-white p-6">
        <div class="mb-6 flex items-center justify-between">
          <p class="text-lg font-bold text-brand-green">Kigali Tech Store</p>
          <Button variant="ghost" size="sm" @click="close">Close</Button>
        </div>
        <nav class="space-y-4 text-sm font-semibold text-slate-700">
          <RouterLink to="/" @click="close">Home</RouterLink>
          <RouterLink to="/products" @click="close">Products</RouterLink>
          <RouterLink to="/cart" @click="close">Cart</RouterLink>
          <RouterLink to="/wishlist" @click="close">Wishlist</RouterLink>
          <RouterLink :to="isAuthenticated ? '/profile' : '/login'" @click="close">
            {{ isAuthenticated ? 'Profile' : 'Login' }}
          </RouterLink>
        </nav>
        <div class="mt-8">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Categories</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
              v-for="category in categories"
              :key="category"
              :to="{ path: '/products', query: { category } }"
              class="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
              @click="close"
            >
              {{ category }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
