<script setup>
import { ref, onMounted } from "vue";

const successMessage = ref("");

onMounted(() => {
  successMessage.value = sessionStorage.getItem("admin_message") || "";

  if (successMessage.value) {
    sessionStorage.removeItem("admin_message");

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  }
});
</script>
<template>

<div
  v-if="successMessage"
  class="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
>
  {{ successMessage }}
</div>


  <div>
    <h2 class="font-serif text-3xl text-[#1c2a22]">
      Dashboard
    </h2>

    <p class="mt-2 text-[#6b756e]">
      Welcome to the RoamNePura admin dashboard.
    </p>
  </div>
</template>