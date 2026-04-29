import { computed, ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com/products';

export const useProductsStore = defineStore('products', () => {
  const all = shallowRef([]);
  const filtered = shallowRef([]);
  const categories = shallowRef([]);
  const loading = ref(false);
  const error = ref('');
  const selectedCategory = ref('');
  const searchQuery = ref('');
  const categoryCache = shallowRef({});
  const productCache = shallowRef({});

  const hasLoaded = computed(() => all.value.length > 0);

  function applyFilters(products) {
    let nextItems = [...products];

    if (selectedCategory.value) {
      nextItems = nextItems.filter((product) => product.category === selectedCategory.value);
    }

    if (searchQuery.value) {
      const normalizedQuery = searchQuery.value.toLowerCase();
      nextItems = nextItems.filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery),
      );
    }

    filtered.value = nextItems;
  }

  async function fetchAll(force = false) {
    if (hasLoaded.value && !force) {
      applyFilters(all.value);
      return all.value;
    }

    loading.value = true;
    error.value = '';

    try {
      const [{ data: products }, { data: nextCategories }] = await Promise.all([
        axios.get(API_BASE_URL),
        axios.get(`${API_BASE_URL}/categories`),
      ]);

      all.value = products;
      categories.value = nextCategories;
      applyFilters(products);
      return products;
    } catch (fetchError) {
      error.value = 'Unable to load products right now. Please try again.';
      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  async function fetchByCategory(category) {
    if (!category) {
      return fetchAll();
    }

    if (categoryCache.value[category]) {
      return categoryCache.value[category];
    }

    loading.value = true;
    error.value = '';

    try {
      const { data } = await axios.get(`${API_BASE_URL}/category/${category}`);
      categoryCache.value = {
        ...categoryCache.value,
        [category]: data,
      };
      return data;
    } catch (fetchError) {
      error.value = 'Unable to load this category right now.';
      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id) {
    if (productCache.value[id]) {
      return productCache.value[id];
    }

    loading.value = true;
    error.value = '';

    try {
      const { data } = await axios.get(`${API_BASE_URL}/${id}`);
      productCache.value = {
        ...productCache.value,
        [id]: data,
      };
      return data;
    } catch (fetchError) {
      error.value = 'Unable to load this product right now.';
      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  function setCategory(category) {
    selectedCategory.value = category || '';
    applyFilters(all.value);
  }

  function setSearch(query) {
    searchQuery.value = query || '';
    applyFilters(all.value);
  }

  return {
    all,
    filtered,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    fetchAll,
    fetchByCategory,
    fetchOne,
    setCategory,
    setSearch,
  };
});
