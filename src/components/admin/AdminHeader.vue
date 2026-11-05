
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getAdminProfile } from "../../api/adminSettings";

defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});

const emit = defineEmits(["menu"]);

const adminName = ref("Administrator");

function updateAdminName(user) {
  if (user?.name) {
    adminName.value = user.name;
  }
}

async function loadAdminName() {
  try {
    const response = await getAdminProfile();
    const user = response.data.user || response.data;

    updateAdminName(user);
  } catch (error) {
    console.error("Unable to load admin name:", error);
  }
}

function handleProfileUpdate(event) {
  updateAdminName(event.detail);
}

onMounted(() => {
  loadAdminName();
  window.addEventListener("admin-profile-updated", handleProfileUpdate);
});

onUnmounted(() => {
  window.removeEventListener("admin-profile-updated", handleProfileUpdate);
});
</script>

<template>
  <header class="sticky top-0 z-30 flex h-[76px] items-center border-b border-[#e8e5dc] bg-[#f8f7f2]/95 px-5 backdrop-blur-md lg:px-8">

    <!-- Mobile menu -->
    <button
      @click="emit('menu')"
      aria-label="Open sidebar"
      class="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#dcd9cf] text-xl text-[#193b2b] transition hover:bg-[#eeeee7] lg:hidden"
    >
      ☰
    </button>

    <!-- Page title -->
    <div>
      <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#9b8051]">
        RoamNePura / Administration
      </p>

      <h1 class="font-serif text-xl font-semibold text-[#193b2b] md:text-2xl">
        {{ title }}
      </h1>
    </div>

    <!-- Right side -->
    <div class="ml-auto flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-[#193b2b]">
          Welcome, {{ adminName }}
        </p>

        <p class="text-xs text-slate-500">
          Administrator
        </p>
      </div>

      <!-- Dynamic Avatar -->
      <div class="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfc99d] bg-[#193b2b] font-semibold uppercase text-[#dfc99d] shadow-sm">
        {{ adminName.charAt(0) || "A" }}
      </div>
    </div>

  </header>
</template>
