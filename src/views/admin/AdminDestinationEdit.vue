<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getAdminDestination,
  updateAdminDestination,
} from "../../api/adminDestinations";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const form = ref({
  name: "",
  slug: "",
  description: "",
  location: "",
  best_time: "",
  duration: "",
  highlights: "",
  is_published: false,
});

const existingImage = ref(null);
const newImage = ref(null);
const imagePreview = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (!file) {
    newImage.value = null;
    imagePreview.value = null;
    return;
  }

  newImage.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const fetchDestination = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAdminDestination(route.params.id);

    const destination = response.data;

    form.value = {
      name: destination.name || "",
      slug: destination.slug || "",
      description: destination.description || "",
      location: destination.location || "",
      best_time: destination.best_time || "",
      duration: destination.duration || "",
      highlights: destination.highlights || "",
      is_published: Boolean(destination.is_published),
    };

    existingImage.value = destination.image || null;

    console.log("Admin destination:", destination);
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Unable to load destination.";
  } finally {
    loading.value = false;
  }
};

const updateDestination = async () => {
  error.value = "";
  saving.value = true;

  try {
    const formData = new FormData();

    formData.append("name", form.value.name);
    formData.append("slug", form.value.slug);
    formData.append("description", form.value.description);
    formData.append("location", form.value.location);
    formData.append("best_time", form.value.best_time);
    formData.append("duration", form.value.duration);
    formData.append("highlights", form.value.highlights);
    formData.append("is_published", form.value.is_published ? "1" : "0");

    if (newImage.value) {
      formData.append("image", newImage.value);
    }

    await updateAdminDestination(
      route.params.id,
      formData
    );

    await router.push({
      path: "/admin/destinations",
      query: {
        success: "updated",
      },
    });
  } catch (err) {
    console.error(err);

    if (err.response?.status === 422) {
      const validationErrors = err.response.data.errors;

      error.value = Object.values(validationErrors)
        .flat()
        .join(" ");
    } else {
      error.value =
        err.response?.data?.message ||
        "Unable to update destination. Please try again.";
    }
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchDestination();
});
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-2xl text-[#1c2a22]">
          Edit Destination
        </h1>

        <p class="mt-1 text-sm text-[#6b756e]">
          Edit destination details.
        </p>
      </div>

      <RouterLink
        to="/admin/destinations"
        class="px-4 py-2 rounded-[10px] border border-[#e7e3da] text-sm font-medium text-[#1c2a22] hover:bg-[#f7f5f0] transition-colors duration-150"
      >
        Back to Destinations
      </RouterLink>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="mt-6 rounded-xl border border-[#e7e3da] bg-white p-8 text-center text-sm text-[#6b756e]"
    >
      Loading destination...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="mt-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <!-- Form -->
    <div
      v-else
      class="mt-6 rounded-xl border border-[#e7e3da] bg-white"
    >
      <form
        @submit.prevent="updateDestination"
        class="p-6 space-y-6"
      >
        <div class="grid gap-5 md:grid-cols-2">

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Destination Name
            </label>

            <input
              v-model="form.name"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Slug
            </label>

            <input
              v-model="form.slug"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-[#1c2a22]">
              Description
            </label>

            <textarea
              v-model="form.description"
              rows="5"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            ></textarea>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Location
            </label>

            <input
              v-model="form.location"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Duration
            </label>

            <input
              v-model="form.duration"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Best Time -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Best Time to Visit
            </label>

            <input
              v-model="form.best_time"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Highlights -->
          <div>
            <label class="block text-sm font-medium text-[#1c2a22]">
              Highlights
            </label>

            <input
              v-model="form.highlights"
              type="text"
              class="mt-2 w-full rounded-[10px] border border-[#e7e3da] px-3 py-2.5 text-sm outline-none focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>
        </div>

        <!-- Published -->
        <div>
          <label class="flex items-center gap-3 text-sm text-[#1c2a22]">
            <input
              v-model="form.is_published"
              type="checkbox"
              class="h-4 w-4 accent-[#1f5c3f]"
            />

            Published
          </label>
        </div>

        <!-- Destination Image -->
<div>
  <p class="text-sm font-medium text-[#1c2a22]">
    Destination Image
  </p>

  <!-- Current Image -->
  <div v-if="existingImage" class="mt-3">
    <p class="text-xs text-[#6b756e] mb-2">
      Current Image
    </p>

    <img
      :src="`http://127.0.0.1:8000/storage/${existingImage}`"
      alt="Current destination"
      class="h-40 w-64 rounded-lg object-cover border border-[#e7e3da]"
    />
  </div>

  <!-- New Image Preview -->
  <div v-if="imagePreview" class="mt-4">
    <p class="text-xs text-[#6b756e] mb-2">
      New Image Preview
    </p>

    <img
      :src="imagePreview"
      alt="New destination preview"
      class="h-40 w-64 rounded-lg object-cover border border-[#e7e3da]"
    />
  </div>

  <!-- File Input -->
  <div class="mt-4">
    <input
      type="file"
      accept="image/jpeg,image/png,image/jpg,image/webp"
      @change="handleImageChange"
      class="block w-full text-sm text-[#6b756e]
             file:mr-4 file:rounded-lg file:border-0
             file:bg-[#e6f0ea] file:px-4 file:py-2
             file:text-sm file:font-medium file:text-[#1f5c3f]
             hover:file:bg-[#d9e8df]"
    />

    <p class="mt-2 text-xs text-[#6b756e]">
      JPG, PNG or WEBP. Maximum 2 MB.
    </p>
  </div>
</div>
        <!-- Actions -->
        <div
          class="flex items-center justify-end gap-3 border-t border-[#e7e3da] pt-6"
        >
          <RouterLink
            to="/admin/destinations"
            class="px-5 py-2.5 rounded-[10px] border border-[#e7e3da] text-sm font-medium text-[#1c2a22] hover:bg-[#f7f5f0] transition-colors duration-150"
          >
            Cancel
          </RouterLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2.5 rounded-[10px] bg-[#1f5c3f] text-white text-sm font-medium hover:bg-[#194d35] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ saving ? "Updating..." : "Update Destination" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>