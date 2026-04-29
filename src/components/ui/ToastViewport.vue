<script setup>
import Toast from './Toast.vue';
import { useToast } from '../../composables/useToast';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="fixed right-4 top-24 z-[70] flex w-full max-w-sm flex-col gap-3">
    <TransitionGroup name="fade">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @dismiss="removeToast"
      />
    </TransitionGroup>
  </div>
</template>
