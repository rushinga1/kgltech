import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from '../stores/products';

export const USD_TO_RWF_RATE = 1300;

export function convertUsdToRwf(value) {
  return Math.round(value * USD_TO_RWF_RATE);
}

export function formatPriceRwf(value) {
  return `RWF ${convertUsdToRwf(value).toLocaleString('en-RW')}`;
}

export function useProducts() {
  const store = useProductsStore();
  const { all, filtered, categories, loading, error, selectedCategory, searchQuery } =
    storeToRefs(store);

  const featuredProducts = computed(() => all.value.slice(0, 8));

  return {
    store,
    all,
    filtered,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    featuredProducts,
    fetchAll: store.fetchAll,
    fetchByCategory: store.fetchByCategory,
    fetchOne: store.fetchOne,
    setCategory: store.setCategory,
    setSearch: store.setSearch,
    formatPriceRwf,
    convertUsdToRwf,
  };
}
