import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';
import { formatPriceRwf } from './useProducts';

export const SHIPPING_FEE_RWF = 2500;
export const VAT_RATE = 0.18;

export function useCart() {
  const store = useCartStore();
  const { items, total, itemCount, isEmpty } = storeToRefs(store);

  const shipping = computed(() => (isEmpty.value ? 0 : SHIPPING_FEE_RWF));
  const tax = computed(() => Math.round(total.value * VAT_RATE));
  const grandTotal = computed(() => total.value + shipping.value + tax.value);

  function formatRwfFromUsd(value) {
    return formatPriceRwf(value);
  }

  function formatRwf(value) {
    return `RWF ${Math.round(value).toLocaleString('en-RW')}`;
  }

  return {
    items,
    total,
    itemCount,
    isEmpty,
    shipping,
    tax,
    grandTotal,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQty: store.updateQty,
    clearCart: store.clearCart,
    formatRwfFromUsd,
    formatRwf,
  };
}
