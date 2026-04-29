import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kt-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kt-theme', 'light');
    }
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('kt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true;
    }
    applyTheme();
  });

  watch(isDark, applyTheme);

  return {
    isDark,
    toggleTheme
  };
}
