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
  <section class="page-shell py-20">
    <div class="mx-auto max-w-md panel p-10 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue">Security</p>
      <h1 class="mt-3 text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
      <form class="mt-10 space-y-6" @submit.prevent="submit">
        <Input v-model="form.email" label="Email Address" type="email" :error="errors.email" class="dark:bg-slate-800 dark:text-white" />
        <div class="space-y-3">
          <Input
            v-model="form.password"
            label="Account Password"
            :type="showPassword ? 'text' : 'password'"
            :error="errors.password"
            class="dark:bg-slate-800 dark:text-white"
          />
          <button type="button" class="text-xs font-black uppercase tracking-widest text-brand-green hover:underline" @click="showPassword = !showPassword">
            {{ showPassword ? 'Secret Access' : 'Reveal Access' }}
          </button>
        </div>
        <Button type="submit" size="lg" class="w-full rounded-2xl shadow-xl shadow-brand-blue/20">Sign In</Button>
      </form>
      <p class="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        New to the tech scene?
        <RouterLink to="/register" class="font-black text-brand-green hover:underline ml-1">Create Account</RouterLink>
      </p>
    </div>
  </section>
</template>
