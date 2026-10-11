<script setup>
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { adminLogout } from "../../api/adminAuth";

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const router = useRouter();

const navigation = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
  { name: "Destinations", path: "/admin/destinations", icon: "◉" },
  { name: "Tours", path: "/admin/tours", icon: "◇" },
  { name: "Bookings", path: "/admin/bookings", icon: "▣" },
  { name: "Inquiries", path: "/admin/inquiries", icon: "✉" },
  { name: "Settings", path: "/admin/settings", icon: "⚙" },
];

const handleLogout = async () => {
  const token = authStore.token;

  try {
    if (token) {
      await adminLogout(token);
    }
  } catch (error) {
    console.error("Backend logout failed:", error);
  } finally {
    sessionStorage.setItem(
      "admin_message",
      "You have been logged out successfully."
    );

    authStore.logout();
    emit("close");
    await router.push("/admin/login");
  }
};
</script>



<template>
  <aside class="h-full w-[236px] border-r border-[#e7e3da] bg-white flex flex-col">

    <!-- Logo -->
    <div class="h-[76px] px-5 flex items-center border-b border-[#e7e3da]">
      <div class="w-8 h-8 rounded-lg bg-[#1f5c3f] flex items-center justify-center text-white text-lg">
        ▲
      </div>

      <div class="ml-3 text-xl font-serif font-semibold text-[#1c2a22]">
        Roam<span class="text-[#1f5c3f]">NePura</span>
      </div>

      <!-- Mobile close -->
      <button
        @click="emit('close')"
        class="ml-auto lg:hidden text-[#6b756e] text-xl"
      >
        ×
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-5 space-y-1">

      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        @click="emit('close')"
        class="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-[#6b756e] transition-colors duration-150"
        active-class="bg-[#e6f0ea] text-[#1f5c3f] font-semibold"
      >
        <span class="w-5 text-center">
          {{ item.icon }}
        </span>

        <span>{{ item.name }}</span>
      </RouterLink>

    </nav>

    <!-- Admin -->
    <div class="border-t border-[#e7e3da] p-4">

      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-[#1f5c3f] text-white flex items-center justify-center text-sm font-semibold">
          A
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-[#1c2a22]">
            Admin
          </p>

          <p class="text-xs text-[#6b756e] truncate">
            admin@roamnepura.com
          </p>
        </div>

        <button
  @click="handleLogout"
  class="w-8 h-8 rounded-lg border border-[#e7e3da] text-[#6b756e] hover:text-red-600 hover:border-red-200 transition-colors duration-150"
  title="Logout"
>
  ↪
</button>
      </div>

    </div>

  </aside>
</template>