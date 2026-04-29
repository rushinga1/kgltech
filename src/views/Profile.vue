<script setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const route = useRoute();
const { user, updateDisplayName, logout } = useAuth();
const { success } = useToast();

const settingsName = ref(user.value?.displayName || '');
const activeTab = computed(() => {
  if (route.path.endsWith('/orders')) {
    return 'orders';
  }

  return route.query.tab === 'settings' ? 'settings' : 'account';
});

function saveSettings() {
  updateDisplayName(settingsName.value);
  success('Display name updated.');
}
</script>

<template>
  <section class="page-shell py-10">
    <div class="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside class="panel p-6">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-xl font-bold text-white">
            {{ user?.displayName?.slice(0, 1) || 'K' }}
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900">{{ user?.displayName }}</h1>
            <p class="text-sm text-slate-500">{{ user?.email }}</p>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-500">Joined {{ user?.joinDate }}</p>
        <Button class="mt-6 w-full" variant="outline" @click="logout">Logout</Button>
      </aside>

      <div class="space-y-6">
        <nav class="flex flex-wrap gap-3">
          <RouterLink to="/profile" class="rounded-full px-4 py-2 text-sm font-semibold" :class="activeTab === 'account' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600'">Account Info</RouterLink>
          <RouterLink to="/profile/orders" class="rounded-full px-4 py-2 text-sm font-semibold" :class="activeTab === 'orders' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600'">My Orders</RouterLink>
          <RouterLink to="/profile?tab=settings" class="rounded-full px-4 py-2 text-sm font-semibold" :class="activeTab === 'settings' ? 'bg-brand-blue text-white' : 'bg-white text-slate-600'">Settings</RouterLink>
        </nav>

        <div v-if="activeTab === 'account'" class="panel p-6">
          <h2 class="text-xl font-bold text-slate-900">Account Info</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div class="rounded-3xl bg-slate-50 p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
              <p class="mt-2 font-semibold text-slate-900">{{ user?.email }}</p>
            </div>
            <div class="rounded-3xl bg-slate-50 p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Display Name</p>
              <p class="mt-2 font-semibold text-slate-900">{{ user?.displayName }}</p>
            </div>
          </div>
        </div>

        <RouterView v-else-if="activeTab === 'orders'" />

        <div v-else class="panel p-6">
          <h2 class="text-xl font-bold text-slate-900">Settings</h2>
          <form class="mt-5 max-w-md space-y-4" @submit.prevent="saveSettings">
            <Input v-model="settingsName" label="Display name" />
            <Button type="submit">Save changes</Button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
