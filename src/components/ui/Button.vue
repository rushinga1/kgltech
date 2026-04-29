<script setup>
import { computed } from 'vue';

const props = defineProps({
  as: {
    type: String,
    default: 'button',
  },
  href: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object],
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const tagName = computed(() => props.as);

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };
  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-sky-600',
    secondary: 'bg-brand-green text-white hover:bg-emerald-800',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:border-brand-blue hover:text-brand-blue',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    accent: 'bg-brand-yellow text-slate-900 hover:bg-brand-gold',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return [base, sizes[props.size], variants[props.variant]].join(' ');
});
</script>

<template>
  <component
    :is="tagName"
    :class="classes"
    :href="href || undefined"
    :to="to || undefined"
    :type="tagName === 'button' ? type : undefined"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </component>
</template>
