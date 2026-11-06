
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import AdminSidebar from "../components/admin/AdminSidebar.vue";
import AdminHeader from "../components/admin/AdminHeader.vue";

const router = useRouter();
const sidebarOpen = ref(false);

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const ACTIVITY_SYNC_INTERVAL = 60 * 1000;

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

let inactivityTimer = null;
let lastActivity = Date.now();
let lastActivitySync = 0;

function logoutDueToInactivity() {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");

    clearTimeout(inactivityTimer);

    router.replace("/admin/login");
}

async function syncBackendActivity(force = false) {
    const now = Date.now();

    if (
        !force &&
        now - lastActivitySync < ACTIVITY_SYNC_INTERVAL
    ) {
        return;
    }

    const token = sessionStorage.getItem("admin_token");

    if (!token) {
        logoutDueToInactivity();
        return;
    }

    lastActivitySync = now;

    try {
        await axios.post(
            `${API_URL}/admin/activity`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
    } catch (error) {
        if (error.response?.status === 401) {
            logoutDueToInactivity();
        }
    }
}

function resetInactivityTimer() {
    lastActivity = Date.now();

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
        logoutDueToInactivity();
    }, INACTIVITY_LIMIT);

    syncBackendActivity();
}

function checkInactivity() {
    if (Date.now() - lastActivity >= INACTIVITY_LIMIT) {
        logoutDueToInactivity();
    }
}

const activityEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click",
];

onMounted(() => {
    if (!sessionStorage.getItem("admin_token")) {
        router.replace("/admin/login");
        return;
    }

    activityEvents.forEach((event) => {
        window.addEventListener(event, resetInactivityTimer, {
            passive: true,
        });
    });

    document.addEventListener("visibilitychange", checkInactivity);

    resetInactivityTimer();
});

onUnmounted(() => {
    clearTimeout(inactivityTimer);

    activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
    });

    document.removeEventListener("visibilitychange", checkInactivity);
});
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
