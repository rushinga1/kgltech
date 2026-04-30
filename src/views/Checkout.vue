<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';
import Spinner from '../components/ui/Spinner.vue';
import { useAuth } from '../composables/useAuth';
import { useCart } from '../composables/useCart';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { user, saveOrder } = useAuth();
const { items, isEmpty, shipping, tax, grandTotal, clearCart, formatRwf, formatRwfFromUsd } =
  useCart();
const { success, error, info } = useToast();

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const provinces = ['Kigali City', 'Northern', 'Southern', 'Eastern', 'Western'];
const STRIPE_SERVER_URL = import.meta.env.VITE_STRIPE_SERVER_URL || 'http://localhost:4242';

const step = ref(1);
const processing = ref(false);
const stripeReady = ref(false);
const paymentFallback = ref(false);
const stripeError = ref('');
const stripeInstance = ref(null);
const stripeElements = ref(null);
const cardElement = ref(null);
const clientSecret = ref('');
const shippingForm = reactive({
  name: user.value?.displayName || '',
  phone: '',
  address: '',
  city: 'Kigali',
  province: 'Kigali City',
});

const canContinue = computed(
  () =>
    shippingForm.name &&
    shippingForm.phone &&
    shippingForm.address &&
    shippingForm.city &&
    shippingForm.province,
);

async function initStripe() {
  if (!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === 'pk_test_your_key_here') {
    paymentFallback.value = true;
    return;
  }

  try {
    stripeError.value = '';
    stripeInstance.value = await loadStripe(STRIPE_PUBLIC_KEY);
    stripeReady.value = Boolean(stripeInstance.value);
    paymentFallback.value = !stripeReady.value;
  } catch {
    paymentFallback.value = true;
  }
}

async function mountStripeElements() {
  if (!stripeInstance.value) {
    return;
  }

  await nextTick();
  const mountTarget = document.getElementById('card-element');
  if (!mountTarget) {
    return;
  }

  if (!stripeElements.value) {
    stripeElements.value = stripeInstance.value.elements();
  }

  if (!cardElement.value) {
    cardElement.value = stripeElements.value.create('card', {
      hidePostalCode: true,
    });
    cardElement.value.mount(mountTarget);
    cardElement.value.on('change', (event) => {
      stripeError.value = event.error?.message || '';
    });
  }
}

async function ensurePaymentIntent() {
  if (paymentFallback.value) {
    return;
  }
  if (clientSecret.value) {
    return;
  }

  const response = await fetch(`${STRIPE_SERVER_URL}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(grandTotal.value),
      currency: 'rwf',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Unable to start payment.');
  }

  if (!data?.clientSecret) {
    throw new Error('Unable to start payment.');
  }

  clientSecret.value = data.clientSecret;
}

function nextStep() {
  if (step.value === 1 && !canContinue.value) {
    error('Complete the shipping form before continuing.');
    return;
  }
  step.value = Math.min(3, step.value + 1);
}

function previousStep() {
  step.value = Math.max(1, step.value - 1);
}

async function completeOrder() {
  processing.value = true;

  try {
    if (!paymentFallback.value) {
      if (!stripeInstance.value || !cardElement.value) {
        throw new Error('Stripe is not ready yet.');
      }

      await ensurePaymentIntent();

      const { error: confirmError, paymentIntent } = await stripeInstance.value.confirmCardPayment(
        clientSecret.value,
        {
          payment_method: {
            card: cardElement.value,
            billing_details: {
              name: shippingForm.name,
              email: user.value?.email,
              phone: shippingForm.phone,
              address: {
                line1: shippingForm.address,
                city: shippingForm.city,
                state: shippingForm.province,
                country: 'RW',
              },
            },
          },
        },
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed.');
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not completed.');
      }
    }

    const order = {
      id: `KTS-${Date.now()}`,
      date: new Date().toLocaleDateString('en-RW'),
      total: grandTotal.value,
      shipping: { ...shippingForm },
      items: items.value,
    };

    saveOrder(order);
    clearCart();
    success(paymentFallback.value ? 'Test payment completed in fallback mode.' : 'Payment confirmed.');
    router.push('/order-success');
  } catch (submitError) {
    error(submitError.message || 'Payment failed. Please try again.');
  } finally {
    processing.value = false;
  }
}

onMounted(() => {
  if (isEmpty.value) {
    info('Your cart is empty. Add products before checking out.');
    router.push('/products');
    return;
  }
  initStripe();
});

watch(step, (nextStepValue) => {
  if (nextStepValue === 3 && stripeReady.value && !paymentFallback.value) {
    mountStripeElements();
    ensurePaymentIntent().catch((intentError) => {
      paymentFallback.value = true;
      stripeError.value = intentError.message || 'Stripe server is not available.';
    });
  }
});

onBeforeUnmount(() => {
  if (cardElement.value) {
    cardElement.value.destroy();
    cardElement.value = null;
  }
});
</script>

<template>
  <section class="page-shell py-10">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Checkout</p>
      <h1 class="mt-2 text-3xl font-black text-slate-900 dark:text-white">Secure your order</h1>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div class="panel p-8 dark:bg-slate-900">
        <div class="mb-10 flex gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <span :class="step >= 1 ? 'text-brand-blue' : 'text-slate-400'">01. Shipping</span>
          <span :class="step >= 2 ? 'text-brand-blue' : 'text-slate-400'">02. Review</span>
          <span :class="step >= 3 ? 'text-brand-blue' : 'text-slate-400'">03. Payment</span>
        </div>

        <form v-if="step === 1" class="grid gap-6 md:grid-cols-2" @submit.prevent="nextStep">
          <Input v-model="shippingForm.name" label="Full name" class="dark:bg-slate-800 dark:text-white" />
          <Input v-model="shippingForm.phone" label="Phone number" class="dark:bg-slate-800 dark:text-white" />
          <Input v-model="shippingForm.address" label="Address" class="dark:bg-slate-800 dark:text-white" />
          <Input v-model="shippingForm.city" label="City" class="dark:bg-slate-800 dark:text-white" />
          <label class="flex flex-col gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span>Rwanda province</span>
            <select v-model="shippingForm.province" class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-4 text-sm dark:text-white focus:ring-4 focus:ring-brand-blue/5">
              <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
            </select>
          </label>
          <div class="md:col-span-2 pt-4">
            <Button type="submit" size="lg" class="w-full md:w-fit px-10 shadow-lg shadow-brand-blue/20">Continue to Review</Button>
          </div>
        </form>

        <div v-else-if="step === 2" class="space-y-4">
          <article v-for="item in items" :key="item.id" class="flex items-center justify-between gap-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 p-6 border border-slate-100 dark:border-white/5">
            <div>
              <h2 class="font-black text-slate-900 dark:text-white">{{ item.title }}</h2>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Qty {{ item.qty }}</p>
            </div>
            <p class="font-black text-brand-green">{{ formatRwfFromUsd(item.price * item.qty) }}</p>
          </article>
          <div class="flex flex-wrap gap-4 pt-6">
            <Button variant="outline" size="lg" class="px-8 dark:text-white dark:border-white/10" @click="previousStep">Back</Button>
            <Button size="lg" class="px-10 shadow-lg shadow-brand-blue/20" @click="nextStep">Proceed to Payment</Button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-if="paymentFallback" class="rounded-[2rem] border border-brand-yellow/30 bg-brand-yellow/5 p-6 text-sm font-semibold text-brand-yellow">
            <div class="flex items-center gap-3">
               <span class="text-2xl">⚠️</span>
               <span>Stripe test mode is not configured locally, running in demo fallback mode.</span>
            </div>
          </div>
          <div v-else-if="stripeReady" class="rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 dark:bg-white/5">
            <p class="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest mb-4">Secure Card Entry</p>
            <div id="card-element" class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-6" />
            <p v-if="stripeError" class="mt-4 text-sm font-black text-red-500">{{ stripeError }}</p>
          </div>
          <div class="flex flex-wrap gap-4 pt-4">
            <Button variant="outline" size="lg" class="px-8 dark:text-white dark:border-white/10" @click="previousStep">Back</Button>
            <Button size="lg" class="px-12 shadow-xl shadow-brand-blue/20" :disabled="processing" @click="completeOrder">
              <span v-if="processing" class="flex items-center gap-2"><Spinner /> Processing</span>
              <span v-else>{{ paymentFallback ? 'Complete Demo Payment' : 'Pay Now' }}</span>
            </Button>
          </div>
        </div>
      </div>

      <aside class="panel h-fit p-8 dark:bg-slate-900">
        <h2 class="text-xl font-black text-slate-900 dark:text-white">Order Total</h2>
        <div class="mt-8 space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(grandTotal - shipping - tax) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping Charge</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(shipping) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Sales Tax</span>
            <span class="text-slate-900 dark:text-white font-black">{{ formatRwf(tax) }}</span>
          </div>
        </div>
        <div class="mt-8 border-t border-slate-200 dark:border-white/10 pt-6">
           <div class="flex items-center justify-between text-2xl font-black text-brand-green">
              <span>Total</span>
              <span>{{ formatRwf(grandTotal) }}</span>
           </div>
        </div>
      </aside>
    </div>
  </section>
  </section>
</template>
