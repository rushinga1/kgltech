import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

const ORDERS_STORAGE_KEY = 'kts-orders';
const ORDER_SUCCESS_KEY = 'kts-can-view-order-success';

function readOrders() {
  const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  return rawOrders ? JSON.parse(rawOrders) : [];
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function useAuth() {
  const store = useAuthStore();
  const { user, token, isAuthenticated } = storeToRefs(store);

  const orders = computed(() => readOrders());

  function saveOrder(order) {
    const nextOrders = [order, ...readOrders()];
    writeOrders(nextOrders);
    sessionStorage.setItem(ORDER_SUCCESS_KEY, 'true');
  }

  function canViewOrderSuccess() {
    return sessionStorage.getItem(ORDER_SUCCESS_KEY) === 'true';
  }

  function consumeOrderSuccessAccess() {
    sessionStorage.removeItem(ORDER_SUCCESS_KEY);
  }

  return {
    user,
    token,
    isAuthenticated,
    orders,
    login: store.login,
    logout: store.logout,
    register: store.register,
    updateDisplayName: store.updateDisplayName,
    saveOrder,
    canViewOrderSuccess,
    consumeOrderSuccessAccess,
  };
}
