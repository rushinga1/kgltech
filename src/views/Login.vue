<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const { login } = useAuth();
const { success, error } = useToast();

const form = reactive({
  email: '',
  password: '',
});
const errors = reactive({
  email: '',
  password: '',
});
const showPassword = ref(false);

const redirectTarget = computed(() => route.query.redirect || '/profile');

function validate() {
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'Enter a valid email address.';
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  return !errors.email && !errors.password;
}

function submit() {
  if (!validate()) {
    error('Please fix the highlighted login errors.');
    return;
  }

  try {
    login(form.email, form.password);
    success('Welcome back to Kigali Tech Store.');
    router.push(String(redirectTarget.value));
  } catch (submitError) {
    error(submitError.message);
  }
}
</script>

<template>
  <section class="page-shell py-12">
    <div class="mx-auto max-w-lg panel p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Login</p>
      <h1 class="mt-3 text-3xl font-black text-slate-900">Access your account</h1>
      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <Input v-model="form.email" label="Email" type="email" :error="errors.email" />
        <div class="space-y-2">
          <Input
            v-model="form.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :error="errors.password"
          />
          <button type="button" class="text-sm font-semibold text-brand-green" @click="showPassword = !showPassword">
            {{ showPassword ? 'Hide password' : 'Show password' }}
          </button>
        </div>
        <Button type="submit" class="w-full">Login</Button>
      </form>
      <p class="mt-5 text-sm text-slate-500">
        Need an account?
        <RouterLink to="/register" class="font-semibold text-brand-green">Register here</RouterLink>
      </p>
    </div>
  </section>
</template>
