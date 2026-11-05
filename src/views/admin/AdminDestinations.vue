<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  getAdminDestinations,
  deleteAdminDestination,
  toggleAdminDestinationPublish,
} from "../../api/adminDestinations";

// State
const destinations = ref([]);
const loading = ref(false);
const error = ref("");
const deletingId = ref(null);
const togglingId = ref(null);
const successMessage = ref("");

// Router
const route = useRoute();
const router = useRouter();

// Success message timer
let successTimer = null;

const showSuccessMessage = (message) => {
  successMessage.value = message;

  if (successTimer) {
    clearTimeout(successTimer);
  }

  successTimer = setTimeout(() => {
    successMessage.value = "";
    successTimer = null;
  }, 4000);
};

// Fetch destinations
const fetchDestinations = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAdminDestinations();

    destinations.value = response.data;

    console.log("Admin Destinations:", response.data);
  } catch (err) {
    console.error("Fetch destinations error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to load destinations.";
  } finally {
    loading.value = false;
  }
};

// Delete destination
const deleteDestination = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this destination?"
  );

  if (!confirmed) {
    return;
  }

  deletingId.value = id;
  error.value = "";

  try {
    await deleteAdminDestination(id);

    destinations.value = destinations.value.filter(
      (destination) => destination.id !== id
    );

    showSuccessMessage(
      "Destination deleted successfully."
    );
  } catch (err) {
    console.error("Delete destination error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to delete destination. Please try again.";
  } finally {
    deletingId.value = null;
  }
};

// Toggle publish status
const togglePublish = async (id) => {
  togglingId.value = id;
  error.value = "";

  try {
    const response = await toggleAdminDestinationPublish(id);

    const updatedDestination = response.data.destination;

    const index = destinations.value.findIndex(
      (destination) => destination.id === id
    );

    if (index !== -1) {
      destinations.value[index] = updatedDestination;
    }

    showSuccessMessage(response.data.message);
  } catch (err) {
    console.error("Toggle publish error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to update publish status. Please try again.";
  } finally {
    togglingId.value = null;
  }
};

// Check success message from redirect
const checkSuccessMessage = () => {
  if (route.query.success === "created") {
    showSuccessMessage(
      "Destination created successfully."
    );
  } else if (route.query.success === "updated") {
    showSuccessMessage(
      "Destination updated successfully."
    );
  }
};

// Lifecycle hooks
onMounted(() => {
  checkSuccessMessage();
  fetchDestinations();
});

onUnmounted(() => {
  if (successTimer) {
    clearTimeout(successTimer);
  }
});
</script>

<template>
  <div>

    <!-- Page Header -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="font-serif text-3xl text-[#1c2a22]">
          Destinations
        </h2>

        <p class="mt-2 text-sm text-[#6b756e]">
          Manage the destinations displayed on RoamNePura.
        </p>
      </div>

      <button
        @click="router.push('/admin/destinations/create')"
        class="rounded-[10px] bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194d35]"
      >
        + Add Destination
      </button>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mt-5 mb-5 flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm"
      :class="
        successMessage.toLowerCase().includes('unpublished')
          ? 'border border-red-200 bg-red-50 text-red-600'
          : 'border border-green-200 bg-[#e6f0ea] text-[#1f5c3f]'
      "
    >
      <span class="font-semibold">
        {{ successMessage.toLowerCase().includes("unpublished") ? "!" : "✓" }}
      </span>

      <span>{{ successMessage }}</span>
    </div>

    <!-- Destination Table -->
    <div
      class="mt-6 overflow-x-auto rounded-xl border border-[#e7e3da]"
    >
      <table class="w-full text-left">

        <!-- Table Header -->
        <thead class="bg-[#f7f5f0]">
          <tr>
            <th class="px-5 py-4 text-xs font-semibold uppercase text-[#6b756e]">
              Destination
            </th>

            <th class="px-5 py-4 text-xs font-semibold uppercase text-[#6b756e]">
              Location
            </th>

            <th class="px-5 py-4 text-xs font-semibold uppercase text-[#6b756e]">
              Duration
            </th>

            <th class="px-5 py-4 text-xs font-semibold uppercase text-[#6b756e]">
              Status
            </th>

            <th class="px-5 py-4 text-xs font-semibold uppercase text-[#6b756e]">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-[#e7e3da]">

          <!-- Loading -->
          <tr v-if="loading">
            <td
              colspan="5"
              class="px-5 py-12 text-center text-sm text-[#6b756e]"
            >
              Loading destinations...
            </td>
          </tr>

          <!-- Error -->
          <tr v-else-if="error">
            <td colspan="5" class="px-5 py-12 text-center">
              <p class="text-sm text-red-600">
                {{ error }}
              </p>

              <button
                @click="fetchDestinations"
                class="mt-3 rounded-lg bg-[#1f5c3f] px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-[#194d35]"
              >
                Try Again
              </button>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-else-if="destinations.length === 0">
            <td colspan="5" class="px-5 py-12 text-center">
              <p class="text-sm font-medium text-[#1c2a22]">
                No destinations found
              </p>

              <p class="mt-1 text-sm text-[#6b756e]">
                Add your first destination to get started.
              </p>
            </td>
          </tr>

          <!-- Destinations -->
          <template v-else>
            <tr
              v-for="destination in destinations"
              :key="destination.id"
              class="transition-colors duration-150 hover:bg-[#f7f5f0]"
            >

              <!-- Destination Name -->
              <td class="px-5 py-4">
                <div class="font-medium text-[#1c2a22]">
                  {{ destination.name }}
                </div>

                <div class="mt-1 text-xs text-[#6b756e]">
                  {{ destination.slug }}
                </div>
              </td>

              <!-- Location -->
              <td class="px-5 py-4 text-sm text-[#6b756e]">
                {{ destination.location || "—" }}
              </td>

              <!-- Duration -->
              <td class="px-5 py-4 text-sm text-[#6b756e]">
                {{ destination.duration || "—" }}
              </td>

              <!-- Status -->
              <td class="px-5 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    destination.is_published
                      ? 'bg-[#e6f0ea] text-[#1f5c3f]'
                      : 'bg-[#eeeae3] text-[#6b756e]'
                  "
                >
                  {{ destination.is_published ? "Published" : "Draft" }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">

                  <!-- Edit -->
                  <button
                    @click="router.push(`/admin/destinations/${destination.id}/edit`)"
                    class="rounded-lg border border-[#e7e3da] px-3 py-1.5 text-sm text-[#1c2a22] transition-colors duration-150 hover:bg-[#f7f5f0]"
                  >
                    Edit
                  </button>

                  <!-- Publish / Unpublish -->
                  <button
                    @click="togglePublish(destination.id)"
                    :disabled="togglingId === destination.id"
                    class="rounded-lg border px-3 py-1.5 text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
                    :class="
                      destination.is_published
                        ? 'border-[#e7e3da] text-[#1f5c3f] hover:bg-[#e6f0ea]'
                        : 'border-red-200 text-red-600 hover:bg-red-50'
                    "
                  >
                    {{
                      togglingId === destination.id
                        ? "Updating..."
                        : destination.is_published
                          ? "Unpublish"
                          : "Publish"
                    }}
                  </button>

                  <!-- Delete -->
                  <button
                    @click="deleteDestination(destination.id)"
                    :disabled="deletingId === destination.id"
                    class="rounded-lg border border-[#e7e3da] px-3 py-1.5 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {{
                      deletingId === destination.id
                        ? "Deleting..."
                        : "Delete"
                    }}
                  </button>

                </div>
              </td>
            </tr>
          </template>

        </tbody>
      </table>
    </div>

  </div>
</template>
