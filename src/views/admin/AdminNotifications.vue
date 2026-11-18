<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "../../api/adminNotifications";

const router = useRouter();

const notifications = ref([]);
const unreadCount = ref(0);
const loading = ref(false);
const errorMessage = ref("");

const typeFilter = ref("all");
const readFilter = ref("all");

const currentPage = ref(1);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: null,
  to: null,
});

let refreshInterval = null;

async function loadNotifications(page = currentPage.value) {
  if (loading.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await getAdminNotifications(page, {
  type: typeFilter.value,
  status: readFilter.value,
});

    notifications.value = response.data.notifications || [];
    unreadCount.value = response.data.unread_count || 0;

    pagination.value = response.data.pagination || pagination.value;
    currentPage.value = pagination.value.current_page || page;

  } catch (error) {
    console.error("Unable to load notifications:", error);
    errorMessage.value = "Unable to load notifications. Please try again.";
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (
    page < 1 ||
    page > pagination.value.last_page ||
    page === currentPage.value
  ) {
    return;
  }

  loadNotifications(page);
}

async function openNotification(notification) {
  try {
    const response = await markAdminNotificationAsRead(notification.id);

    notifications.value = notifications.value.map((item) =>
      item.id === notification.id
        ? {
            ...item,
            read_at: item.read_at || new Date().toISOString(),
          }
        : item
    );

    if (typeof response.data.unread_count === "number") {
      unreadCount.value = response.data.unread_count;
    } else if (!notification.read_at) {
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }

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
    const response = await markAllAdminNotificationsAsRead();

    notifications.value = notifications.value.map((item) => ({
      ...item,
      read_at: item.read_at || new Date().toISOString(),
    }));

    unreadCount.value = response.data.unread_count ?? 0;
  } catch (error) {
    console.error("Unable to mark all notifications as read:", error);
  }
}

function handleTypeFilter(value) {
  typeFilter.value = value;
  currentPage.value = 1;
  loadNotifications(1);
}

function handleReadFilter(value) {
  readFilter.value = value;
  currentPage.value = 1;
  loadNotifications(1);
}

function formatNotificationDate(date) {
  if (!date) return "";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "";

  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(seconds);

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (absoluteSeconds < 60) {
    return formatter.format(seconds, "second");
  }

  if (absoluteSeconds < 3600) {
    return formatter.format(Math.round(seconds / 60), "minute");
  }

  if (absoluteSeconds < 86400) {
    return formatter.format(Math.round(seconds / 3600), "hour");
  }

  if (absoluteSeconds < 604800) {
    return formatter.format(Math.round(seconds / 86400), "day");
  }

  return new Date(date).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

onMounted(() => {
  loadNotifications(1);

  // Automatically refresh notifications every 30 seconds.
  refreshInterval = window.setInterval(() => {
    if (!loading.value && document.visibilityState === "visible") {
      loadNotifications(currentPage.value);
    }
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    window.clearInterval(refreshInterval);
  }
});
</script>

<template>
  <div class="space-y-6">

    <!-- Page Heading -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#9b8051]">
          Administration
        </p>

        <h2 class="mt-1 font-serif text-2xl font-semibold text-[#193b2b]">
          Notifications
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Keep track of your latest bookings and inquiries.
        </p>
      </div>

      <button
        @click="loadNotifications(currentPage)"
        :disabled="loading"
        class="rounded-xl border border-[#dcd9cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#193b2b] transition hover:bg-[#f1f0e9] disabled:opacity-50"
      >
        {{ loading ? "Refreshing..." : "Refresh" }}
      </button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border border-[#e8e5dc] bg-white p-5">
        <p class="text-sm text-slate-500">Total notifications</p>

        <p class="mt-2 text-3xl font-semibold text-[#193b2b]">
          {{ pagination.total }}
        </p>
      </div>

      <div class="rounded-2xl border border-[#e8e5dc] bg-white p-5">
        <p class="text-sm text-slate-500">Unread notifications</p>

        <p class="mt-2 text-3xl font-semibold text-[#9b8051]">
          {{ unreadCount }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-4 rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in [
            { label: 'All', value: 'all' },
            { label: 'Bookings', value: 'booking' },
            { label: 'Inquiries', value: 'inquiry' },
          ]"
          :key="filter.value"
          @click="handleTypeFilter(filter.value)"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="
            typeFilter === filter.value
              ? 'bg-[#193b2b] text-white'
              : 'bg-[#f3f1e9] text-slate-600 hover:bg-[#e9e6dc]'
          "
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          :value="readFilter"
          @change="handleReadFilter($event.target.value)"
          class="rounded-xl border border-[#dcd9cf] bg-white px-3 py-2 text-sm text-[#193b2b] outline-none focus:border-[#9b8051]"
        >
          <option value="all">All statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>

        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="rounded-xl bg-[#f3eee2] px-4 py-2 text-sm font-semibold text-[#8b7045] transition hover:bg-[#e9dfca]"
        >
          Mark all as read
        </button>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div
      v-if="loading && notifications.length === 0"
      class="rounded-2xl border border-[#e8e5dc] bg-white px-5 py-12 text-center text-sm text-slate-500"
    >
      Loading notifications...
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && notifications.length === 0"
      class="rounded-2xl border border-[#e8e5dc] bg-white px-5 py-16 text-center"
    >
      <div class="mb-3 text-4xl">🔔</div>

      <h3 class="font-semibold text-[#193b2b]">
        No notifications found
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        Try changing your filters or check back when new activity arrives.
      </p>
    </div>

    <!-- Notification List -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white"
    >
      <button
        v-for="notification in notifications"
        :key="notification.id"
        @click="openNotification(notification)"
        class="flex w-full gap-4 border-b border-[#eeeae1] p-5 text-left transition last:border-b-0 hover:bg-[#faf9f5]"
        :class="{ 'bg-[#f8f7f2]': !notification.read_at }"
      >
        <!-- Icon -->
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg"
          :class="
            notification.data?.type === 'booking'
              ? 'bg-[#e5eee7] text-[#193b2b]'
              : 'bg-[#f3eee2] text-[#9b8051]'
          "
        >
          <span v-if="notification.data?.type === 'booking'">✈</span>
          <span v-else>✉</span>
        </div>

        <!-- Details -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-[#193b2b]">
              {{ notification.data?.title || "Notification" }}
            </h3>

            <span
              v-if="!notification.read_at"
              class="rounded-full bg-[#f8e8e6] px-2.5 py-1 text-[10px] font-semibold text-red-600"
            >
              Unread
            </span>

            <span
              v-else
              class="rounded-full bg-[#eeeee9] px-2.5 py-1 text-[10px] font-semibold text-slate-500"
            >
              Read
            </span>
          </div>

          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ notification.data?.message }}
          </p>

          <p class="mt-2 text-xs text-slate-400">
            {{ formatNotificationDate(notification.created_at) }}
          </p>
        </div>

        <div class="hidden items-center text-slate-400 sm:flex">
          →
        </div>
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.total > 0"
      class="flex flex-col gap-4 rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-slate-500">
        Showing
        <span class="font-semibold text-[#193b2b]">{{ pagination.from }}</span>
        to
        <span class="font-semibold text-[#193b2b]">{{ pagination.to }}</span>
        of
        <span class="font-semibold text-[#193b2b]">{{ pagination.total }}</span>
        notifications
      </p>

      <div class="flex items-center gap-3">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1 || loading"
          class="rounded-xl border border-[#dcd9cf] px-4 py-2 text-sm font-semibold text-[#193b2b] transition hover:bg-[#f3f1e9] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span class="text-sm font-medium text-[#193b2b]">
          {{ currentPage }} / {{ pagination.last_page }}
        </span>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= pagination.last_page || loading"
          class="rounded-xl border border-[#dcd9cf] px-4 py-2 text-sm font-semibold text-[#193b2b] transition hover:bg-[#f3f1e9] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</template>
