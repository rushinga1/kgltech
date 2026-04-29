import { ref, onMounted } from 'vue';

const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

export function useTheme() {
  function toggleTheme() {
    if (typeof document === 'undefined') return;
    
    document.documentElement.classList.toggle('dark');
    isDark.value = document.documentElement.classList.contains('dark');
    
    localStorage.setItem('kt-theme', isDark.value ? 'dark' : 'light');
  }

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
  });

  return {
    isDark,
    toggleTheme
  };
}
