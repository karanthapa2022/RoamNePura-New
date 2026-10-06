<script setup>
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});

const emit = defineEmits(["menu"]);
</script>

<template>
  <header class="h-[76px] bg-white border-b border-[#e7e3da] flex items-center px-5 lg:px-7">

    <!-- Mobile menu -->
    <button
      @click="emit('menu')"
      class="lg:hidden mr-4 w-9 h-9 rounded-lg border border-[#e7e3da] text-[#1c2a22]"
    >
      ☰
    </button>

    <div>
      <p class="text-xs text-[#6b756e] mb-0.5">
        Admin
      </p>

      <h1 class="font-serif text-[21px] text-[#1c2a22]">
        {{ title }}
      </h1>
    </div>

    <div class="ml-auto flex items-center gap-4">

      <!-- Notification -->
      <button
        class="relative w-9 h-9 rounded-lg border border-[#e7e3da] flex items-center justify-center text-[#6b756e]"
      >
        ♧

        <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
      </button>

      <!-- Avatar -->
      <div class="w-9 h-9 rounded-full bg-[#1f5c3f] text-white flex items-center justify-center text-sm font-semibold">
        A
      </div>

    </div>

  </header>
</template>