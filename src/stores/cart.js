import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const USD_TO_RWF_RATE = 1300;

export const useCartStore = defineStore('cart', () => {
  const items = useLocalStorage('kts-cart-items', []);

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty * USD_TO_RWF_RATE, 0),
  );
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));
  const isEmpty = computed(() => items.value.length === 0);

  function addItem(product, quantity = 1) {
    const existingItem = items.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.qty = Math.min(existingItem.qty + quantity, 99);
      return;
    }

    items.value.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: quantity,
      category: product.category,
    });
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function updateQty(id, qty) {
    const existingItem = items.value.find((item) => item.id === id);
    if (!existingItem) {
      return;
    }

    existingItem.qty = Math.min(Math.max(qty, 1), 99);
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    total,
    itemCount,
    isEmpty,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };
});
