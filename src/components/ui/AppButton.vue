
<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) =>
    ['primary', 'secondary', 'outline', 'danger', 'light'].includes(value),
    },
    type: {
        type: String,
        default: 'button',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    fullWidth: {
        type: Boolean,
        default: false,
    },
})

const buttonClasses = computed(() => {
    const baseClasses =
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

    
const variants = {
    primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]',
    secondary:
        'bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-secondary-hover)] focus:ring-[var(--color-primary)]',
    outline:
        'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[var(--color-background)] focus:ring-[var(--color-primary)]',
    danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    light:
        'bg-white text-[var(--color-primary)] hover:bg-green-50 focus:ring-white',
}
    return [
        baseClasses,
        variants[props.variant] || variants.primary,
        props.fullWidth ? 'w-full' : '',
    ]
})
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        :class="buttonClasses"
    >
        <svg
            v-if="loading"
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>

        <slot />
    </button>
</template>