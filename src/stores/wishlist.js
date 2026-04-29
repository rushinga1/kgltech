import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = useLocalStorage('kts-wishlist-items', []);

  const count = computed(() => items.value.length);

  function isWishlisted(id) {
    return items.value.some((item) => item.id === id);
  }

  function toggleItem(product) {
    if (isWishlisted(product.id)) {
      items.value = items.value.filter((item) => item.id !== product.id);
      return false;
    }

    items.value.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    return true;
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  return {
    items,
    count,
    isWishlisted,
    toggleItem,
    removeItem,
  };
});
