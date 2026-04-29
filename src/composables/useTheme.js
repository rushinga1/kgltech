import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

// Initialize early to avoid flash
const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('kt-theme') : null;
const prefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  isDark.value = true;
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  function applyTheme() {
    if (typeof document === 'undefined') return;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kt-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kt-theme', 'light');
    }
  }

  onMounted(applyTheme);
  watch(isDark, applyTheme);

  return {
    isDark,
    toggleTheme
  };
}
