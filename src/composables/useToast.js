import { computed, readonly, ref } from 'vue';

const TOAST_DURATION = 4000;
const toasts = ref([]);

export function useToast() {
  const visibleToasts = readonly(toasts);

  function removeToast(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function pushToast(message, type = 'info') {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    toasts.value.push({
      id,
      message,
      type,
    });

    window.setTimeout(() => removeToast(id), TOAST_DURATION);
  }

  return {
    toasts: computed(() => visibleToasts.value),
    success: (message) => pushToast(message, 'success'),
    error: (message) => pushToast(message, 'error'),
    info: (message) => pushToast(message, 'info'),
    removeToast,
  };
}
