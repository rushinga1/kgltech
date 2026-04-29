import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/products',
    component: () => import('../views/ProductsLayout.vue'),
    children: [
      {
        path: '',
        name: 'Products',
        component: () => import('../views/ProductsList.vue'),
      },
      {
        path: ':id',
        name: 'ProductDetail',
        component: () => import('../views/ProductDetail.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue'),
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../views/Wishlist.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: () => import('../views/OrderSuccess.vue'),
    meta: {
      requiresOrderAccess: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'orders',
        name: 'ProfileOrders',
        component: () => import('../views/ProfileOrders.vue'),
      },
      {
        path: 'wishlist',
        redirect: '/wishlist',
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return {
      name: 'Profile',
    };
  }

  if (to.meta.requiresOrderAccess) {
    const canView = sessionStorage.getItem('kts-can-view-order-success') === 'true';
    if (!canView) {
      return {
        name: 'Home',
      };
    }
  }

  return true;
});

router.afterEach((to) => {
  if (to.name === 'OrderSuccess') {
    sessionStorage.removeItem('kts-can-view-order-success');
  }
});

export default router;
