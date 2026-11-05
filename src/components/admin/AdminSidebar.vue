<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { adminLogout } from "../../api/adminAuth";
import { getAdminProfile } from "../../api/adminSettings";

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const router = useRouter();

const adminName = ref("Administrator");
const adminEmail = ref("");

const navigation = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
  { name: "Destinations", path: "/admin/destinations", icon: "◈" },
  { name: "Tours", path: "/admin/tours", icon: "◇" },
  { name: "Bookings", path: "/admin/bookings", icon: "▣" },
  { name: "Inquiries", path: "/admin/inquiries", icon: "✉" },
  { name: "Settings", path: "/admin/settings", icon: "⚙" },
];

function updateAdminDetails(user) {
  if (user?.name) adminName.value = user.name;
  if (user?.email) adminEmail.value = user.email;
}

async function loadAdminProfile() {
  try {
    const response = await getAdminProfile();
    const user = response.data.user || response.data;

    updateAdminDetails(user);
  } catch (error) {
    console.error("Unable to load admin profile:", error);
  }
}

function handleProfileUpdate(event) {
  updateAdminDetails(event.detail);
}

onMounted(() => {
  loadAdminProfile();
  window.addEventListener("admin-profile-updated", handleProfileUpdate);
});

onUnmounted(() => {
  window.removeEventListener("admin-profile-updated", handleProfileUpdate);
});

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
  <aside class="flex h-full w-[260px] flex-col bg-[#193b2b] text-white shadow-xl">

    <!-- Logo -->
    <div class="flex h-[76px] items-center border-b border-white/10 px-6">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dfc99d] text-lg font-bold text-[#193b2b]">
        R
      </div>

      <div class="ml-3 font-serif text-xl font-semibold tracking-wide">
        Roam<span class="text-[#dfc99d]">NePura</span>
      </div>

      <button
        @click="emit('close')"
        aria-label="Close sidebar"
        class="ml-auto text-2xl text-white/70 transition hover:text-white lg:hidden"
      >
        ×
      </button>
    </div>

    <!-- Navigation heading -->
    <div class="px-6 pb-3 pt-8">
      <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfc99d]/75">
        Main Menu
      </p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-2 px-4">
      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        @click="emit('close')"
        class="group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-white/70 transition duration-200 hover:bg-white/10 hover:text-white"
        active-class="!bg-[#dfc99d] !text-[#193b2b] !font-semibold shadow-md"
      >
        <span class="flex h-6 w-6 items-center justify-center text-lg">
          {{ item.icon }}
        </span>

        <span>{{ item.name }}</span>

        <span class="ml-auto h-1.5 w-1.5 rounded-full bg-transparent group-[.router-link-active]:bg-[#193b2b]"></span>
      </RouterLink>
    </nav>

    <!-- Bottom section -->
    <div class="border-t border-white/10 p-5">
      <div class="flex items-center gap-3">

        <!-- Dynamic Avatar -->
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfc99d]/40 bg-[#dfc99d] text-sm font-bold uppercase text-[#193b2b]">
          {{ adminName.charAt(0) || "A" }}
        </div>

        <!-- Dynamic Admin Details -->
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-white">
            {{ adminName }}
          </p>

          <p class="truncate text-xs text-white/55">
            {{ adminEmail }}
          </p>
        </div>

        <!-- Logout -->
        <button
          @click="handleLogout"
          title="Logout"
          aria-label="Logout"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-lg text-white/70 transition hover:border-red-300/40 hover:bg-red-500/15 hover:text-red-200"
        >
          ↪
        </button>

      </div>

      <p class="mt-5 text-center text-[10px] tracking-wide text-white/35">
        © 2026 RoamNePura Admin
      </p>
    </div>

  </aside>
</template>
