<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAdminDestinations } from "../../api/adminDestinations";

const destinations = ref([]);
const loading = ref(false);
const error = ref("");
const route = useRoute();
const router = useRouter();
const successMessage = ref("");

const fetchDestinations = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAdminDestinations();

    destinations.value = response.data;
    console.log("Admin Destinations:", response.data);
  } catch (err) {
    console.error(err);
    error.value = "Unable to load destinations.";
  } finally {
    loading.value = false;
  }
};

const checkSuccessMessage = () => {
  if (route.query.success === "created") {
    successMessage.value = "Destination created successfully.";
  }

  if (route.query.success === "updated") {
    successMessage.value = "Destination updated successfully.";
  }

  if (successMessage.value) {
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
  }
};
onMounted(() => {
  checkSuccessMessage();
  fetchDestinations();
});
</script>
<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

    <div
  v-if="successMessage"
  class="mb-5 flex items-center gap-3 rounded-[10px] border border-green-200 bg-[#e6f0ea] px-4 py-3 text-sm text-[#1f5c3f]"
>
  <span class="font-semibold">✓</span>

  <span>{{ successMessage }}</span>
</div>

    <!-- Destination Table -->
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
    <td
      colspan="5"
      class="px-5 py-12 text-center"
    >
      <p class="text-sm text-red-600">
        {{ error }}
      </p>

      <button
        @click="fetchDestinations"
        class="mt-3 px-4 py-2 rounded-lg bg-[#1f5c3f] text-white text-sm hover:bg-[#194d35] transition-colors duration-150"
      >
        Try Again
      </button>
    </td>
  </tr>

  <!-- Empty -->
  <tr v-else-if="destinations.length === 0">
    <td
      colspan="5"
      class="px-5 py-12 text-center"
    >
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
      class="hover:bg-[#f7f5f0] transition-colors duration-150"
    >
      <td class="px-5 py-4">
        <div class="font-medium text-[#1c2a22]">
          {{ destination.name }}
        </div>

        <div class="text-xs text-[#6b756e] mt-1">
          {{ destination.slug }}
        </div>
      </td>

      <td class="px-5 py-4 text-sm text-[#6b756e]">
        {{ destination.location || "—" }}
      </td>

      <td class="px-5 py-4 text-sm text-[#6b756e]">
        {{ destination.duration || "—" }}
      </td>

      <td class="px-5 py-4">
        <span
          class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
          :class="
            destination.is_published
              ? 'bg-[#e6f0ea] text-[#1f5c3f]'
              : 'bg-[#eeeae3] text-[#6b756e]'
          "
        >
          {{ destination.is_published ? "Published" : "Draft" }}
        </span>
      </td>

      <td class="px-5 py-4">
        <div class="flex items-center gap-2">
          <button
  @click="router.push(`/admin/destinations/${destination.id}/edit`)"
  class="px-3 py-1.5 rounded-lg border border-[#e7e3da] text-sm text-[#1c2a22] hover:bg-[#f7f5f0] transition-colors duration-150"
>
  Edit
</button>

          <button
            class="px-3 py-1.5 rounded-lg border border-[#e7e3da] text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  </template>

</tbody>
  </div>
</template>