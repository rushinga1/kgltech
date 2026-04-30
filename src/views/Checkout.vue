<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'vue-router';
import { ShieldCheck, Globe } from 'lucide-vue-next';
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
      <h1 class="mt-2 text-3xl font-black text-slate-900">Secure your order</h1>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div class="panel p-6">
        <div class="mb-8 flex gap-3 text-sm font-semibold">
          <span :class="step >= 1 ? 'text-brand-blue' : 'text-slate-400'">1. Shipping</span>
          <span :class="step >= 2 ? 'text-brand-blue' : 'text-slate-400'">2. Review</span>
          <span :class="step >= 3 ? 'text-brand-blue' : 'text-slate-400'">3. Payment</span>
        </div>

        <form v-if="step === 1" class="grid gap-4 md:grid-cols-2" @submit.prevent="nextStep">
          <Input v-model="shippingForm.name" label="Full name" />
          <Input v-model="shippingForm.phone" label="Phone number" />
          <Input v-model="shippingForm.address" label="Address" />
          <Input v-model="shippingForm.city" label="City" />
          <label class="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Rwanda province</span>
            <select v-model="shippingForm.province" class="rounded-2xl border border-slate-200 px-4 py-3">
              <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
            </select>
          </label>
          <div class="md:col-span-2">
            <Button type="submit">Continue to Review</Button>
          </div>
        </form>

        <div v-else-if="step === 2" class="space-y-4">
          <article v-for="item in items" :key="item.id" class="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4">
            <div>
              <h2 class="font-semibold text-slate-900">{{ item.title }}</h2>
              <p class="text-sm text-slate-500">Qty {{ item.qty }}</p>
            </div>
            <p class="font-semibold text-brand-green">{{ formatRwfFromUsd(item.price * item.qty) }}</p>
          </article>
          <div class="flex gap-3">
            <Button variant="outline" @click="previousStep">Back</Button>
            <Button @click="nextStep">Proceed to Payment</Button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-if="paymentFallback" class="glass rounded-3xl border border-brand-yellow/30 bg-brand-yellow/5 p-6 shadow-xl">
            <div class="flex items-start gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/20 text-brand-gold">
                <ShieldCheck :size="24" />
              </div>
              <div class="space-y-1">
                <p class="font-black text-slate-900 dark:text-white">Payment System Notice</p>
                <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  The production payment gateway is not active. We've enabled <strong>Technical Demo Mode</strong> so you can complete your project evaluation. No real funds will be deducted.
                </p>
                <p v-if="stripeError" class="mt-4 rounded-xl bg-red-500/10 p-3 text-xs font-bold text-red-500 ring-1 ring-red-500/20">
                  Technical Detail: {{ stripeError }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="!paymentFallback && stripeReady" class="panel p-8 dark:bg-slate-900 shadow-premium">
            <div class="mb-6">
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue">Secure Payment</p>
              <h3 class="mt-2 text-xl font-black text-slate-900 dark:text-white">Credit or Debit Card</h3>
            </div>
            
            <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-6">
              <div id="card-element" class="min-h-12" />
            </div>

            <p v-if="stripeError" class="mt-4 text-sm font-bold text-red-500 flex items-center gap-2">
               <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
               {{ stripeError }}
            </p>
            
            <div class="mt-6 flex items-center gap-4 text-xs font-bold text-slate-400">
              <Globe :size="14" />
              <span>Payments secured by Stripe 256-bit encryption</span>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <Button variant="outline" size="lg" class="px-8" @click="previousStep">Back</Button>
            <Button :disabled="processing" size="lg" class="flex-1 shadow-xl shadow-brand-blue/20" @click="completeOrder">
              <span v-if="processing" class="flex items-center gap-2 justify-center"><Spinner /> Securing Order...</span>
              <span v-else class="flex items-center gap-2 justify-center">
                {{ paymentFallback ? 'Complete Demo Order' : 'Confirm & Pay' }}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <aside class="panel h-fit p-6">
        <h2 class="text-xl font-bold text-slate-900">Order Total</h2>
        <div class="mt-5 space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{{ formatRwf(grandTotal - shipping - tax) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Shipping</span>
            <span>{{ formatRwf(shipping) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>VAT</span>
            <span>{{ formatRwf(tax) }}</span>
          </div>
        </div>
        <div class="mt-5 border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
          {{ formatRwf(grandTotal) }}
        </div>
      </aside>
    </div>
  </section>
</template>
