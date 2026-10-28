
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { getAdminBookings } from "../../api/adminBookings";

const bookings = ref([]);
const loading = ref(true);
const error = ref("");
const search = ref("");
const selectedBooking = ref(null);

const currentPage = ref(1);
const perPage = 10;

// Total travelers across all bookings
const totalTravelers = computed(() =>
    bookings.value.reduce(
        (total, booking) => total + (Number(booking.travelers) || 0),
        0
    )
);

// Search bookings by customer name, email, phone, or tour
const filteredBookings = computed(() => {
    const query = search.value.trim().toLowerCase();

    if (!query) return bookings.value;

    return bookings.value.filter((booking) =>
        [
            booking.name,
            booking.email,
            booking.phone,
            booking.tour,
        ].some((value) =>
            String(value ?? "").toLowerCase().includes(query)
        )
    );
});

// Pagination calculations
const totalPages = computed(() =>
    Math.ceil(filteredBookings.value.length / perPage)
);

const paginatedBookings = computed(() => {
    const start = (currentPage.value - 1) * perPage;

    return filteredBookings.value.slice(start, start + perPage);
});

const startItem = computed(() =>
    filteredBookings.value.length === 0
        ? 0
        : (currentPage.value - 1) * perPage + 1
);

const endItem = computed(() =>
    Math.min(
        currentPage.value * perPage,
        filteredBookings.value.length
    )
);

function goToPage(page) {
    if (page < 1 || page > totalPages.value) return;

    currentPage.value = page;
}

// Return to page 1 whenever the search changes
watch(search, () => {
    currentPage.value = 1;
});

// Keep the current page valid when filtering reduces the result count
watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
        currentPage.value = Math.max(1, pages);
    }
});

// Format dates safely
function formatDate(date) {
    if (!date) return "—";

    const value = String(date);

    const parsedDate = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? `${value}T12:00:00`
            : value
    );

    if (Number.isNaN(parsedDate.getTime())) return value;

    return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// Fetch bookings from the Laravel backend
async function loadBookings() {
    loading.value = true;
    error.value = "";

    try {
        const response = await getAdminBookings();

        bookings.value = Array.isArray(response.data)
            ? response.data
            : [];

        currentPage.value = 1;
    } catch (err) {
        console.error("Failed to load bookings:", err);

        error.value =
            err.response?.status === 401 ||
            err.response?.status === 403
                ? "Your admin session may have expired. Please log in again."
                : "Unable to load bookings. Check your connection and try again.";
    } finally {
        loading.value = false;
    }
}

onMounted(loadBookings);
</script>

<template>
    <div class="min-h-screen bg-[#f7f5f0] p-4 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
            <!-- Page heading -->
            <header class="mb-8">
                <p
                    class="text-sm font-semibold uppercase tracking-wider text-[#1f5c3f]"
                >
                    Administration
                </p>

                <div
                    class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <h1
                            class="text-3xl font-bold tracking-tight text-[#1c2a22]"
                        >
                            Tour Bookings
                        </h1>

                        <p class="mt-2 text-sm text-gray-600">
                            Manage and review customer booking requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="loadBookings"
                        :disabled="loading"
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17472f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span aria-hidden="true">↻</span>
                        {{ loading ? "Refreshing..." : "Refresh bookings" }}
                    </button>
                </div>
            </header>

            <!-- Summary cards -->
            <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                    class="rounded-2xl border border-[#e7e3da] bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-600">
                            Total bookings
                        </p>

                        <span
                            class="rounded-lg bg-[#edf4ee] p-2 text-[#1f5c3f]"
                        >
                            <svg
                                class="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="16"
                                    rx="2"
                                />
                                <path d="M16 3v4M8 3v4M3 10h18" />
                            </svg>
                        </span>
                    </div>

                    <p class="mt-4 text-3xl font-bold text-[#1c2a22]">
                        {{ bookings.length }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        All recorded bookings
                    </p>
                </div>

                <div
                    class="rounded-2xl border border-[#e7e3da] bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-600">
                            Total travelers
                        </p>

                        <span
                            class="rounded-lg bg-[#edf4ee] p-2 text-[#1f5c3f]"
                        >
                            <svg
                                class="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                aria-hidden="true"
                            >
                                <circle cx="9" cy="8" r="3" />
                                <path
                                    d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20"
                                />
                            </svg>
                        </span>
                    </div>

                    <p class="mt-4 text-3xl font-bold text-[#1c2a22]">
                        {{ totalTravelers }}
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        Combined travelers across all bookings
                    </p>
                </div>
            </section>

            <!-- Bookings table -->
            <section
                class="overflow-hidden rounded-2xl border border-[#e7e3da] bg-white shadow-sm"
            >
                <!-- Table heading and search -->
                <div
                    class="flex flex-col gap-4 border-b border-[#e7e3da] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h2 class="text-lg font-bold text-[#1c2a22]">
                            All bookings
                        </h2>

                        <p class="mt-1 text-sm text-gray-500">
                            Review customer and trip information.
                        </p>
                    </div>

                    <div class="relative w-full sm:max-w-sm">
                        <svg
                            class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16 16 4 4" />
                        </svg>

                        <input
                            v-model="search"
                            type="search"
                            placeholder="Search name, email, phone, or tour..."
                            aria-label="Search bookings"
                            class="w-full rounded-lg border border-[#e7e3da] bg-[#faf9f6] py-2.5 pl-10 pr-4 text-sm text-[#1c2a22] outline-none transition placeholder:text-gray-400 focus:border-[#1f5c3f] focus:ring-2 focus:ring-[#1f5c3f]/10"
                        />
                    </div>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="p-12 text-center">
                    <div
                        class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e7e3da] border-t-[#1f5c3f]"
                    ></div>

                    <p class="mt-4 text-sm text-gray-500">
                        Loading bookings...
                    </p>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="p-10 text-center">
                    <p class="font-semibold text-red-700">
                        Could not load bookings
                    </p>

                    <p class="mt-2 text-sm text-gray-600">
                        {{ error }}
                    </p>

                    <button
                        type="button"
                        @click="loadBookings"
                        class="mt-5 rounded-lg bg-[#1f5c3f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17472f]"
                    >
                        Try again
                    </button>
                </div>

                <!-- No bookings -->
                <div
                    v-else-if="bookings.length === 0"
                    class="p-12 text-center"
                >
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4ee] text-[#1f5c3f]"
                    >
                        <span class="text-xl" aria-hidden="true">▤</span>
                    </div>

                    <h3 class="mt-4 font-semibold text-[#1c2a22]">
                        No bookings yet
                    </h3>

                    <p class="mt-2 text-sm text-gray-500">
                        Customer submissions will appear here.
                    </p>
                </div>

                <!-- No search results -->
                <div
                    v-else-if="filteredBookings.length === 0"
                    class="p-10 text-center"
                >
                    <h3 class="font-semibold text-[#1c2a22]">
                        No matching bookings
                    </h3>

                    <p class="mt-2 text-sm text-gray-500">
                        Try a different name, email, phone number, or tour.
                    </p>

                    <button
                        type="button"
                        @click="search = ''"
                        class="mt-4 text-sm font-semibold text-[#1f5c3f] hover:underline"
                    >
                        Clear search
                    </button>
                </div>

                <!-- Booking results -->
                <template v-else>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[760px] text-left text-sm">
                            <thead
                                class="bg-[#faf9f6] text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                <tr>
                                    <th scope="col" class="px-5 py-4">
                                        Customer
                                    </th>
                                    <th scope="col" class="px-5 py-4">
                                        Tour
                                    </th>
                                    <th scope="col" class="px-5 py-4">
                                        Travel date
                                    </th>
                                    <th scope="col" class="px-5 py-4">
                                        Travelers
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-5 py-4 text-right"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-[#eeeae2]">
                                <tr
                                    v-for="booking in paginatedBookings"
                                    :key="booking.id"
                                    class="transition-colors hover:bg-[#faf9f6]"
                                >
                                    <td class="px-5 py-4">
                                        <p
                                            class="font-semibold text-[#1c2a22]"
                                        >
                                            {{
                                                booking.name ||
                                                "Unnamed customer"
                                            }}
                                        </p>

                                        <p class="mt-1 text-xs text-gray-500">
                                            {{
                                                booking.email ||
                                                "No email provided"
                                            }}
                                        </p>
                                    </td>

                                    <td class="px-5 py-4">
                                        <span
                                            class="inline-flex max-w-[220px] items-center rounded-md bg-[#edf4ee] px-2.5 py-1.5 text-xs font-semibold text-[#1f5c3f]"
                                        >
                                            {{
                                                booking.tour ||
                                                "Tour not specified"
                                            }}
                                        </span>
                                    </td>

                                    <td
                                        class="whitespace-nowrap px-5 py-4 text-gray-600"
                                    >
                                        {{ formatDate(booking.travel_date) }}
                                    </td>

                                    <td class="px-5 py-4">
                                        <span
                                            class="inline-flex min-w-8 items-center justify-center rounded-full border border-[#e7e3da] px-2.5 py-1 font-semibold text-[#1c2a22]"
                                        >
                                            {{ booking.travelers ?? "—" }}
                                        </span>
                                    </td>

                                    <td class="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            @click="selectedBooking = booking"
                                            class="rounded-lg border border-[#d8e5da] px-3 py-2 text-xs font-semibold text-[#1f5c3f] transition hover:bg-[#edf4ee]"
                                        >
                                            View details
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination: only below the bookings table -->
                    <div
                        class="flex flex-col gap-4 border-t border-[#e7e3da] bg-[#faf9f6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <p class="text-xs text-gray-500">
                            Showing {{ startItem }}–{{ endItem }}
                            of {{ filteredBookings.length }} booking(s)
                        </p>

                        <nav
                            v-if="totalPages > 1"
                            aria-label="Bookings pagination"
                            class="flex flex-wrap items-center justify-end gap-1"
                        >
                            <button
                                type="button"
                                :disabled="currentPage === 1"
                                @click="goToPage(currentPage - 1)"
                                class="rounded-lg border border-[#e7e3da] px-3 py-2 text-sm text-[#1c2a22] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                v-for="page in totalPages"
                                :key="page"
                                type="button"
                                @click="goToPage(page)"
                                :aria-current="
                                    currentPage === page ? 'page' : undefined
                                "
                                :class="[
                                    'min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition',
                                    currentPage === page
                                        ? 'border-[#1f5c3f] bg-[#1f5c3f] text-white'
                                        : 'border-[#e7e3da] bg-white text-[#1c2a22] hover:bg-[#edf4ee]',
                                ]"
                            >
                                {{ page }}
                            </button>

                            <button
                                type="button"
                                :disabled="currentPage === totalPages"
                                @click="goToPage(currentPage + 1)"
                                class="rounded-lg border border-[#e7e3da] px-3 py-2 text-sm text-[#1c2a22] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </template>
            </section>
        </div>

        <!-- Booking details modal -->
        <div
            v-if="selectedBooking"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17251d]/50 p-4 backdrop-blur-sm"
            @click.self="selectedBooking = null"
            @keydown.esc="selectedBooking = null"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-detail-title"
                class="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Modal header -->
                <header
                    class="flex items-start justify-between gap-4 border-b border-[#e7e3da] bg-[#faf9f6] p-5 sm:p-6"
                >
                    <div>
                        <p
                            class="text-xs font-semibold uppercase tracking-wider text-[#1f5c3f]"
                        >
                            Booking information
                        </p>

                        <h2
                            id="booking-detail-title"
                            class="mt-1 text-xl font-bold text-[#1c2a22]"
                        >
                            {{ selectedBooking.name || "Customer details" }}
                        </h2>

                        <p class="mt-1 text-sm text-gray-500">
                            Booking #{{ selectedBooking.id }}
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Close booking details"
                        @click="selectedBooking = null"
                        class="rounded-lg p-2 text-gray-500 hover:bg-[#eae7df] hover:text-[#1c2a22]"
                    >
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <path d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                </header>

                <!-- Modal content -->
                <div class="space-y-6 p-5 sm:p-6">
                    <!-- Customer details -->
                    <div>
                        <h3
                            class="mb-3 text-sm font-semibold text-[#1c2a22]"
                        >
                            Customer details
                        </h3>

                        <div
                            class="grid gap-4 rounded-xl border border-[#e7e3da] p-4 sm:grid-cols-2"
                        >
                            <div>
                                <p class="text-xs text-gray-500">Full name</p>
                                <p
                                    class="mt-1 break-words text-sm font-medium text-[#1c2a22]"
                                >
                                    {{ selectedBooking.name || "—" }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-500">
                                    Email address
                                </p>
                                <p
                                    class="mt-1 break-all text-sm font-medium text-[#1c2a22]"
                                >
                                    {{ selectedBooking.email || "—" }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-500">
                                    Phone number
                                </p>
                                <p
                                    class="mt-1 text-sm font-medium text-[#1c2a22]"
                                >
                                    {{ selectedBooking.phone || "—" }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Trip details -->
                    <div>
                        <h3
                            class="mb-3 text-sm font-semibold text-[#1c2a22]"
                        >
                            Trip details
                        </h3>

                        <div
                            class="grid gap-4 rounded-xl border border-[#e7e3da] p-4 sm:grid-cols-3"
                        >
                            <div class="sm:col-span-3">
                                <p class="text-xs text-gray-500">
                                    Selected tour
                                </p>

                                <p
                                    class="mt-1 text-sm font-semibold text-[#1f5c3f]"
                                >
                                    {{ selectedBooking.tour || "—" }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-500">
                                    Travel date
                                </p>

                                <p
                                    class="mt-1 text-sm font-medium text-[#1c2a22]"
                                >
                                    {{
                                        formatDate(
                                            selectedBooking.travel_date
                                        )
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-500">Travelers</p>

                                <p
                                    class="mt-1 text-sm font-medium text-[#1c2a22]"
                                >
                                    {{ selectedBooking.travelers ?? "—" }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Customer message -->
                    <div>
                        <h3
                            class="mb-3 text-sm font-semibold text-[#1c2a22]"
                        >
                            Customer message
                        </h3>

                        <div
                            class="min-h-20 whitespace-pre-wrap break-words rounded-xl border border-[#e7e3da] bg-[#faf9f6] p-4 text-sm leading-6 text-gray-700"
                        >
                            {{
                                selectedBooking.message ||
                                "No message provided."
                            }}
                        </div>
                    </div>
                </div>

                <!-- Modal footer: close button only -->
                <footer
                    class="flex justify-end border-t border-[#e7e3da] bg-[#faf9f6] px-5 py-4 sm:px-6"
                >
                    <button
                        type="button"
                        @click="selectedBooking = null"
                        class="rounded-lg bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17472f]"
                    >
                        Close details
                    </button>
                </footer>
            </section>
        </div>
    </div>
</template>
