import { storeToRefs } from 'pinia';
import { useWishlistStore } from '../stores/wishlist';
import { formatPriceRwf } from './useProducts';

export function useWishlist() {
  const store = useWishlistStore();
  const { items, count } = storeToRefs(store);

  return {
    items,
    count,
    isWishlisted: store.isWishlisted,
    toggleItem: store.toggleItem,
    removeItem: store.removeItem,
    formatPriceRwf,
  };
}
