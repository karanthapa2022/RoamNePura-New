
<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAdminProfile } from "../../api/adminSettings";
import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "../../api/adminNotifications";

defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});

const emit = defineEmits(["menu"]);
const router = useRouter();

const adminName = ref("Administrator");

const notifications = ref([]);
const unreadCount = ref(0);
const showNotifications = ref(false);
const loadingNotifications = ref(false);

let notificationInterval = null;

const hasNotifications = computed(() => notifications.value.length > 0);

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

async function loadNotifications() {
  if (loadingNotifications.value) return;

  loadingNotifications.value = true;

  try {
    const response = await getAdminNotifications();

    notifications.value = response.data.notifications || [];
    unreadCount.value = response.data.unread_count || 0;
  } catch (error) {
    console.error("Unable to load notifications:", error);
  } finally {
    loadingNotifications.value = false;
  }
}

async function openNotification(notification) {
  try {
    await markAdminNotificationAsRead(notification.id);

    notifications.value = notifications.value.map((item) =>
      item.id === notification.id
        ? { ...item, read_at: new Date().toISOString() }
        : item
    );

    unreadCount.value = Math.max(0, unreadCount.value - 1);

    showNotifications.value = false;

    const url = notification.data?.url;

    if (url) {
      router.push(url);
    }
  } catch (error) {
    console.error("Unable to open notification:", error);
  }
}

async function markAllAsRead() {
  try {
    await markAllAdminNotificationsAsRead();

    notifications.value = notifications.value.map((item) => ({
      ...item,
      read_at: item.read_at || new Date().toISOString(),
    }));

    unreadCount.value = 0;
  } catch (error) {
    console.error("Unable to mark notifications as read:", error);
  }
}

function formatNotificationDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleString([], {
    dateStyle: "short",
    timeStyle: "short",
  });
}

onMounted(() => {
  loadAdminName();
  loadNotifications();

  window.addEventListener("admin-profile-updated", handleProfileUpdate);

  // Refresh notifications every 30 seconds.
  notificationInterval = window.setInterval(loadNotifications, 30000);
});

onUnmounted(() => {
  window.removeEventListener("admin-profile-updated", handleProfileUpdate);

  if (notificationInterval) {
    window.clearInterval(notificationInterval);
  }
});
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-[76px] items-center border-b border-[#e8e5dc] bg-[#f8f7f2]/95 px-5 backdrop-blur-md lg:px-8"
  >
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

      <!-- Welcome message -->
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold text-[#193b2b]">
          Welcome, {{ adminName }}
        </p>

        <p class="text-xs text-slate-500">
          Administrator
        </p>
      </div>

      <!-- Notification Bell -->
      <div class="relative">
        <button
          @click="showNotifications = !showNotifications"
          aria-label="Notifications"
          class="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dfc99d] bg-white text-[#193b2b] transition hover:bg-[#eeeee7]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>

          <span
            v-if="unreadCount > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white"
          >
            {{ unreadCount > 99 ? "99+" : unreadCount }}
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-0 top-14 z-50 w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-xl sm:w-[390px]"
        >
          <div class="flex items-center justify-between border-b border-[#eeeae1] px-4 py-4">
            <div>
              <h3 class="font-semibold text-[#193b2b]">
                Notifications
              </h3>

              <p class="text-xs text-slate-500">
                {{ unreadCount }} unread notifications
              </p>
            </div>

            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs font-semibold text-[#9b8051] hover:text-[#193b2b]"
            >
              Mark all as read
            </button>
          </div>

          <div class="max-h-[380px] overflow-y-auto">

            <div
              v-if="loadingNotifications && !hasNotifications"
              class="px-4 py-8 text-center text-sm text-slate-500"
            >
              Loading notifications...
            </div>

            <div
              v-else-if="!hasNotifications"
              class="px-4 py-10 text-center"
            >
              <div class="mb-2 text-3xl">🔔</div>
              <p class="text-sm font-medium text-[#193b2b]">
                You're all caught up!
              </p>
              <p class="mt-1 text-xs text-slate-500">
                New bookings and inquiries will appear here.
              </p>
            </div>

            <button
              v-for="notification in notifications"
              :key="notification.id"
              @click="openNotification(notification)"
              class="flex w-full gap-3 border-b border-[#f0eee8] px-4 py-4 text-left transition hover:bg-[#f8f7f2]"
              :class="{
                'bg-[#f8f7f2]': !notification.read_at,
              }"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                :class="
                  notification.data?.type === 'booking'
                    ? 'bg-[#e5eee7] text-[#193b2b]'
                    : 'bg-[#f3eee2] text-[#9b8051]'
                "
              >
                <span v-if="notification.data?.type === 'booking'">
                  ✈
                </span>
                <span v-else>
                  ✉
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-[#193b2b]">
                    {{ notification.data?.title || "Notification" }}
                  </p>

                  <span
                    v-if="!notification.read_at"
                    class="h-2 w-2 shrink-0 rounded-full bg-red-500"
                  ></span>
                </div>

                <p class="mt-1 text-xs leading-5 text-slate-600">
                  {{ notification.data?.message }}
                </p>

                <p class="mt-2 text-[10px] text-slate-400">
                  {{ formatNotificationDate(notification.created_at) }}
                </p>
              </div>
            </button>
          </div>

          <div class="border-t border-[#eeeae1] px-4 py-3">
            <button
              @click="showNotifications = false; router.push('/admin/bookings')"
              class="w-full text-center text-xs font-semibold text-[#193b2b] hover:text-[#9b8051]"
            >
              View Bookings
            </button>
          </div>
        </div>
      </div>

      <!-- Dynamic Avatar -->
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfc99d] bg-[#193b2b] font-semibold uppercase text-[#dfc99d] shadow-sm"
      >
        {{ adminName.charAt(0) || "A" }}
      </div>
    </div>
  </header>
</template>
