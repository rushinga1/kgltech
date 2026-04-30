<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { register } = useAuth();
const { success, error } = useToast();

const form = reactive({
  name: '',
  email: '',
  password: '',
});
const errors = reactive({
  email: '',
  password: '',
});
const showPassword = ref(false);

function validate() {
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'Enter a valid email address.';
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  return !errors.email && !errors.password;
}

function submit() {
  if (!validate()) {
    error('Please fix the highlighted registration errors.');
    return;
  }

  register(form);
  success('Your account is ready.');
  router.push('/profile');
}
</script>

<template>
  <section class="page-shell py-12">
    <div class="mx-auto max-w-lg panel p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Register</p>
      <h1 class="mt-3 text-3xl font-black text-slate-900">Create your account</h1>
      <form class="mt-8 space-y-5" @submit.prevent="submit">
        <Input v-model="form.name" label="Display name" />
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
        <Button type="submit" class="w-full">Register</Button>
      </form>
      <p class="mt-5 text-sm text-slate-500">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-brand-green">Login</RouterLink>
      </p>
    </div>
  </section>
</template>
