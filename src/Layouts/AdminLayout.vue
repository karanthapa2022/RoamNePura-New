<script setup>
import { ref } from "vue";
import AdminSidebar from "../components/admin/AdminSidebar.vue";
import AdminHeader from "../components/admin/AdminHeader.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-[#f7f5f0] text-[#1c2a22]">

    <!-- Desktop Sidebar -->
    <div class="hidden lg:block fixed inset-y-0 left-0 z-40">
      <AdminSidebar />
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
    ></div>

    <!-- Mobile Sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 z-50 lg:hidden"
    >
      <AdminSidebar @close="sidebarOpen = false" />
    </div>

    <!-- Main -->
    <div class="lg:ml-[236px] min-h-screen">

      <AdminHeader @menu="sidebarOpen = true" />

      <main class="p-[26px] max-w-[1280px] mx-auto">
        <RouterView />
      </main>

    </div>

  </div>
</template>