<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import {
  getAdminTours,
  deleteAdminTour,
  toggleAdminTourPublish,
} from "../../api/adminTours";

const router = useRouter();

const tours = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const statusFilter = ref("all");
const deletingId = ref(null);
const selectedTourToDelete = ref(null);
const togglingId = ref(null);
const successMessage = ref("");

let successTimer = null;

function isPublished(tour) {
  return (
    tour.is_published === true ||
    tour.is_published === 1 ||
    tour.is_published === "1"
  );
}

const totalTours = computed(() => tours.value.length);

const publishedTours = computed(
  () => tours.value.filter(isPublished).length
);

const draftTours = computed(
  () => tours.value.filter((tour) => !isPublished(tour)).length
);

const filteredTours = computed(() => {
  const query = search.value.trim().toLowerCase();

  return tours.value.filter((tour) => {
    const matchesSearch =
      !query ||
      [
        tour.name,
        tour.category,
        tour.difficulty,
        tour.duration,
        tour.slug,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );

    const matchesStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "published" && isPublished(tour)) ||
      (statusFilter.value === "draft" && !isPublished(tour));

    return matchesSearch && matchesStatus;
  });
});

function showSuccessMessage(message) {
  successMessage.value = message;

  if (successTimer) clearTimeout(successTimer);

  successTimer = setTimeout(() => {
    successMessage.value = "";
    successTimer = null;
  }, 4000);
}

async function fetchTours() {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAdminTours();

    const result = response.data;

    const rows = Array.isArray(result)
      ? result
      : result.data ?? result.tours ?? [];

    if (!Array.isArray(rows)) {
      throw new Error("Unexpected tours response format.");
    }

    tours.value = rows;
  } catch (err) {
    console.error("Fetch tours error:", err);

    error.value =
      err.response?.data?.message ||
      err.message ||
      "Unable to load tours.";
  } finally {
    loading.value = false;
  }
}

async function togglePublish(id) {
  togglingId.value = id;
  error.value = "";

  try {
    const response = await toggleAdminTourPublish(id);
    const updatedTour = response.data.tour;

    const index = tours.value.findIndex(
      (tour) => tour.id === id
    );

    if (index !== -1 && updatedTour) {
      tours.value[index] = updatedTour;
    }

    showSuccessMessage(
      response.data.message || "Tour status updated successfully."
    );
  } catch (err) {
    console.error("Toggle tour publish error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to update tour status.";
  } finally {
    togglingId.value = null;
  }
}

function deleteTour(tour) {
  selectedTourToDelete.value = tour;
}

function closeDeleteModal() {
  if (deletingId.value !== null) return;

  selectedTourToDelete.value = null;
}

async function confirmDeleteTour() {
  const tour = selectedTourToDelete.value;

  if (!tour || deletingId.value !== null) return;

  deletingId.value = tour.id;
  error.value = "";

  try {
    await deleteAdminTour(tour.id);

    tours.value = tours.value.filter(
      (item) => item.id !== tour.id
    );

    selectedTourToDelete.value = null;

    showSuccessMessage("Tour deleted successfully.");
  } catch (err) {
    console.error("Delete tour error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to delete tour. Please try again.";
  } finally {
    deletingId.value = null;
  }
}

function getImageUrl(image) {
  if (!image) return null;

  if (image.startsWith("http")) return image;

  if (image.startsWith("/")) {
    return `http://127.0.0.1:8000${image}`;
  }

  return `http://127.0.0.1:8000/storage/${image}`;
}

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return "—";

  return `$${amount.toLocaleString("en-US")}`;
}

function galleryCount(tour) {
  return Array.isArray(tour.gallery_images)
    ? tour.gallery_images.length
    : 0;
}

onMounted(fetchTours);

onUnmounted(() => {
  if (successTimer) clearTimeout(successTimer);
});
</script>

<template>
  <main class="space-y-6">

    <!-- Page heading -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-[#9b8051]">
          CONTENT MANAGEMENT
        </p>

        <h1 class="font-serif text-3xl text-[#193b2b]">
          Tour Management
        </h1>

        <p class="mt-2 text-sm text-[#788279]">
          Manage your travel packages, images, pricing and publishing status.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          @click="fetchTours"
          :disabled="loading"
          class="rounded-xl border border-[#e7e3da] bg-white px-4 py-3 text-sm font-medium text-[#193b2b] hover:bg-[#f4f5ee] disabled:opacity-50"
        >
          {{ loading ? "Refreshing..." : "↻ Refresh" }}
        </button>

        <button
          @click="router.push('/admin/tours/create')"
          class="rounded-xl bg-[#193b2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#10271e]"
        >
          + Add New Tour
        </button>
      </div>
    </header>

    <!-- Success message -->
    <div
      v-if="successMessage"
      class="rounded-xl border border-green-200 bg-[#e6f0ea] px-4 py-3 text-sm text-[#1f5c3f]"
      role="status"
    >
      ✓ {{ successMessage }}
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      role="alert"
    >
      <span>{{ error }}</span>

      <button
        @click="fetchTours"
        class="font-semibold underline"
      >
        Try again
      </button>
    </div>

    <!-- Summary cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">

      <article class="rounded-xl border border-[#e9e9e1] bg-white p-5 shadow-sm">
        <p class="text-sm text-[#788279]">Total Tours</p>
        <strong class="mt-3 block font-serif text-3xl font-medium text-[#193b2b]">
          {{ loading ? "…" : totalTours }}
        </strong>
        <p class="mt-2 text-xs text-[#929a92]">All tour packages</p>
      </article>

      <article class="rounded-xl border border-[#e9e9e1] bg-white p-5 shadow-sm">
        <p class="text-sm text-[#788279]">Published Tours</p>
        <strong class="mt-3 block font-serif text-3xl font-medium text-[#28633c]">
          {{ loading ? "…" : publishedTours }}
        </strong>
        <p class="mt-2 text-xs text-[#929a92]">Visible on your website</p>
      </article>

      <article class="rounded-xl border border-[#e9e9e1] bg-white p-5 shadow-sm">
        <p class="text-sm text-[#788279]">Draft Tours</p>
        <strong class="mt-3 block font-serif text-3xl font-medium text-[#9b8051]">
          {{ loading ? "…" : draftTours }}
        </strong>
        <p class="mt-2 text-xs text-[#929a92]">Not published yet</p>
      </article>

    </section>

    <!-- Search and filters -->
    <section class="flex flex-col gap-3 rounded-xl border border-[#e9e9e1] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

      <input
        v-model="search"
        type="search"
        placeholder="Search tours by name, category, difficulty..."
        class="w-full rounded-lg border border-[#e7e3da] bg-[#fafaf7] px-4 py-3 text-sm outline-none transition focus:border-[#193b2b] sm:max-w-md"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in [
            { label: 'All Tours', value: 'all' },
            { label: 'Published', value: 'published' },
            { label: 'Drafts', value: 'draft' }
          ]"
          :key="filter.value"
          @click="statusFilter = filter.value"
          class="rounded-lg px-4 py-2.5 text-xs font-semibold transition"
          :class="statusFilter === filter.value
            ? 'bg-[#193b2b] text-white'
            : 'border border-[#e7e3da] bg-white text-[#657168] hover:bg-[#f4f5ee]'"
        >
          {{ filter.label }}
        </button>
      </div>

    </section>

    <!-- Tours table -->
    <section class="overflow-hidden rounded-xl border border-[#e9e9e1] bg-white shadow-sm">

      <div class="flex items-center justify-between border-b border-[#e9e9e1] px-5 py-4">
        <div>
          <h2 class="font-serif text-xl text-[#193b2b]">
            All Tours
          </h2>
          <p class="mt-1 text-xs text-[#929a92]">
            Showing {{ filteredTours.length }} of {{ totalTours }} tours
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">

        <table class="w-full min-w-[900px] text-left">

          <thead class="bg-[#f7f7f2]">
            <tr>
              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Tour
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Duration
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Difficulty
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Price
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Gallery
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Status
              </th>

              <th class="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#788279]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-[#eeeee8]">

            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="7" class="px-5 py-16 text-center text-sm text-[#788279]">
                Loading your tours...
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="filteredTours.length === 0">
              <td colspan="7" class="px-5 py-16 text-center">
                <p class="font-serif text-xl text-[#193b2b]">
                  {{ search || statusFilter !== "all" ? "No matching tours" : "No tours yet" }}
                </p>

                <p class="mt-2 text-sm text-[#788279]">
                  {{
                    search || statusFilter !== "all"
                      ? "Try changing your search or filter."
                      : "Create your first tour to get started."
                  }}
                </p>

                <button
                  v-if="!search && statusFilter === 'all'"
                  @click="router.push('/admin/tours/create')"
                  class="mt-4 rounded-lg bg-[#193b2b] px-4 py-2.5 text-sm text-white hover:bg-[#10271e]"
                >
                  Add Your First Tour
                </button>
              </td>
            </tr>

            <!-- Tour rows -->
            <tr
              v-for="tour in filteredTours"
              :key="tour.id"
              class="transition hover:bg-[#fafaf7]"
            >

              <td class="px-5 py-4">
                <div class="flex items-center gap-3">

                  <img
                    v-if="getImageUrl(tour.image)"
                    :src="getImageUrl(tour.image)"
                    :alt="tour.name"
                    class="h-14 w-20 rounded-lg border border-[#eeeee8] object-cover"
                  />

                  <div
                    v-else
                    class="flex h-14 w-20 items-center justify-center rounded-lg bg-[#eeeee7] text-xs text-[#788279]"
                  >
                    No image
                  </div>

                  <div class="min-w-0">
                    <p class="font-semibold text-[#193b2b]">
                      {{ tour.name }}
                    </p>

                    <p class="mt-1 text-xs text-[#929a92]">
                      {{ tour.category || tour.slug }}
                    </p>
                  </div>

                </div>
              </td>

              <td class="px-5 py-4 text-sm text-[#657168]">
                {{ tour.duration || "—" }}
              </td>

              <td class="px-5 py-4 text-sm text-[#657168]">
                {{ tour.difficulty || "—" }}
              </td>

              <td class="px-5 py-4 text-sm font-semibold text-[#193b2b]">
                {{ formatPrice(tour.price) }}
              </td>

              <td class="px-5 py-4">
                <span class="rounded-lg bg-[#f4f5ee] px-3 py-1.5 text-xs font-medium text-[#536258]">
                  {{ galleryCount(tour) }} images
                </span>
              </td>

              <td class="px-5 py-4">
                <span
                  class="inline-flex rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="isPublished(tour)
                    ? 'bg-[#e6f0ea] text-[#28633c]'
                    : 'bg-[#f6f0e4] text-[#936018]'"
                >
                  {{ isPublished(tour) ? "Published" : "Draft" }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center gap-2">

                  <button
                    @click="router.push(`/admin/tours/${tour.id}/edit`)"
                    class="rounded-lg border border-[#e7e3da] px-3 py-2 text-xs font-medium text-[#193b2b] hover:bg-[#e6f0ea]"
                  >
                    Edit
                  </button>

                  <button
                    @click="togglePublish(tour.id)"
                    :disabled="togglingId === tour.id || deletingId === tour.id"
                    class="rounded-lg border border-[#e7e3da] px-3 py-2 text-xs font-medium text-[#536258] hover:bg-[#f4f5ee] disabled:opacity-50"
                  >
                    {{
                      togglingId === tour.id
                        ? "Updating..."
                        : isPublished(tour)
                          ? "Unpublish"
                          : "Publish"
                    }}
                  </button>

                  <button
  @click="deleteTour(tour)"
  :disabled="deletingId === tour.id || togglingId === tour.id"
  class="rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
>
  Delete
</button>

                </div>
              </td>

            </tr>

          </tbody>
        </table>
      </div>
    </section>
<!-- Custom Delete Confirmation Modal -->
<div
  v-if="selectedTourToDelete"
  class="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271e]/60 p-4 backdrop-blur-sm"
  @click.self="closeDeleteModal"
>
  <div
    class="w-full max-w-md rounded-2xl border border-[#e9e9e1] bg-[#f8f7f2] p-6 shadow-2xl"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-modal-title"
  >
    <!-- Warning icon -->
    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
      !
    </div>

    <!-- Heading -->
    <div class="mt-5 text-center">
      <h2
        id="delete-modal-title"
        class="font-serif text-2xl text-[#193b2b]"
      >
        Delete this tour?
      </h2>

      <p class="mt-3 text-sm leading-6 text-[#788279]">
        Are you sure you want to delete
        <strong class="text-[#193b2b]">
          {{ selectedTourToDelete.name }}
        </strong>?
        This action cannot be undone.
      </p>
    </div>

    <!-- Actions -->
    <div class="mt-7 flex gap-3">
      <button
        @click="closeDeleteModal"
        :disabled="deletingId !== null"
        class="flex-1 rounded-xl border border-[#deded4] bg-white px-4 py-3 text-sm font-semibold text-[#536258] transition hover:bg-[#eeeee7] disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        @click="confirmDeleteTour"
        :disabled="deletingId !== null"
        class="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ deletingId !== null ? "Deleting..." : "Yes, Delete" }}
      </button>
    </div>
  </div>
</div>
  </main>
</template>
