<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <label class="flex flex-col gap-2 text-sm font-medium text-slate-700">
    <span v-if="label">{{ label }}</span>
    <input
      :id="id || label"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400"
      :aria-invalid="Boolean(error)"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </label>
</template>
