
<script setup>
import { ref } from "vue";
import AdminSidebar from "../components/admin/AdminSidebar.vue";
import AdminHeader from "../components/admin/AdminHeader.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-[#f8f7f2] text-[#193b2b]">

    <!-- Desktop Sidebar -->
    <div class="fixed inset-y-0 left-0 z-40 hidden lg:block">
      <AdminSidebar />
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-[#10271e]/60 backdrop-blur-sm lg:hidden"
    ></div>

    <!-- Mobile Sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 z-50 lg:hidden"
    >
      <AdminSidebar @close="sidebarOpen = false" />
    </div>

    <!-- Main Content -->
    <div class="min-h-screen lg:ml-[260px]">

      <AdminHeader @menu="sidebarOpen = true" />

      <main class="mx-auto min-h-[calc(100vh-76px)] max-w-[1500px] p-5 md:p-7 lg:p-8">
        <RouterView />
      </main>

    </div>

  </div>
</template>
