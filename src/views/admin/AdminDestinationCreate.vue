<script setup>
import { ref } from "vue";
import { createAdminDestination } from "../../api/adminDestinations";
import { useRouter } from "vue-router";


const router = useRouter();

const loading = ref(false);
const error = ref("");
const form = ref({
  name: "",
  slug: "",
  description: "",
  location: "",
  best_time: "",
  duration: "",
  highlights: "",
  is_published: true,
});

const image = ref(null);
const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

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

    if (image.value) {
      formData.append("image", image.value);
    }

    await createAdminDestination(formData);

    await router.push({
  path: "/admin/destinations",
  query: {
    success: "created",
  },
});
  } catch (err) {
    console.error(err);
if (err.response?.status === 422) {
  console.log("Validation response:", err.response.data);

  const validationErrors = err.response.data.errors;

  error.value = Object.values(validationErrors)
    .flat()
    .join(" ");
} else {
  error.value =
    err.response?.data?.message ||
    "Unable to create destination. Please try again.";
}
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-7">
      <div>
        <h2 class="font-serif text-3xl text-[#1c2a22]">
          Add Destination
        </h2>

        <p class="mt-1 text-sm text-[#6b756e]">
          Create a new destination for RoamNePura.
        </p>
      </div>

      <RouterLink
        to="/admin/destinations"
        class="px-4 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm text-[#1c2a22] hover:bg-[#f7f5f0] transition-colors duration-150"
      >
        Back to Destinations
      </RouterLink>
    </div>

    <!-- Form Card -->
    <div class="bg-white border border-[#e7e3da] rounded-xl shadow-[0_1px_2px_rgba(30,40,30,.06)]">
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

        <div
  v-if="error"
  class="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
>
  {{ error }}
</div>

        <!-- Basic Information -->
        <div>
          <h3 class="font-serif text-xl text-[#1c2a22]">
            Basic Information
          </h3>

          <p class="mt-1 text-sm text-[#6b756e]">
            Enter the main information about this destination.
          </p>
        </div>

        <!-- Name + Slug -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label class="block text-sm font-medium text-[#1c2a22] mb-2">
              Destination Name
            </label>

            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Everest Base Camp"
              class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1c2a22] mb-2">
              Slug
            </label>

            <input
              v-model="form.slug"
              type="text"
              placeholder="e.g. everest-base-camp"
              class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
            />

            <p class="mt-1.5 text-xs text-[#6b756e]">
              Used in the destination URL.
            </p>
          </div>

        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-[#1c2a22] mb-2">
            Description
          </label>

          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Describe this destination..."
            class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none resize-y focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
          ></textarea>
        </div>

        <!-- Location + Duration -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label class="block text-sm font-medium text-[#1c2a22] mb-2">
              Location
            </label>

            <input
              v-model="form.location"
              type="text"
              placeholder="e.g. Khumbu, Nepal"
              class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1c2a22] mb-2">
              Duration
            </label>

            <input
              v-model="form.duration"
              type="text"
              placeholder="e.g. 14 days"
              class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
            />
          </div>

        </div>

        <!-- Best Time -->
        <div>
          <label class="block text-sm font-medium text-[#1c2a22] mb-2">
            Best Time to Visit
          </label>

          <input
            v-model="form.best_time"
            type="text"
            placeholder="e.g. March – May, September – November"
            class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
          />
        </div>

        <!-- Highlights -->
        <div>
          <label class="block text-sm font-medium text-[#1c2a22] mb-2">
            Highlights
          </label>

          <textarea
            v-model="form.highlights"
            rows="4"
            placeholder="Enter the main highlights of this destination..."
            class="w-full px-3.5 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm outline-none resize-y focus:border-[#1f5c3f] focus:ring-4 focus:ring-[#e6f0ea]"
          ></textarea>

          <p class="mt-1.5 text-xs text-[#6b756e]">
            For now, separate multiple highlights with commas.
          </p>
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-[#1c2a22] mb-2">
            Destination Image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            @change="image = $event.target.files[0]"
            class="block w-full text-sm text-[#6b756e] file:mr-4 file:py-2.5 file:px-4 file:rounded-[10px] file:border-0 file:bg-[#e6f0ea] file:text-[#1f5c3f] file:font-medium"
          />

          <p class="mt-1.5 text-xs text-[#6b756e]">
            JPG, PNG or WebP. Maximum size: 2 MB.
          </p>
        </div>

        <!-- Published -->
        <div class="flex items-center gap-3">
          <input
            id="is_published"
            v-model="form.is_published"
            type="checkbox"
            class="w-4 h-4 accent-[#1f5c3f]"
          />

          <label
            for="is_published"
            class="text-sm text-[#1c2a22]"
          >
            Publish this destination immediately
          </label>
        </div>

        <!-- Actions -->
        <div class="pt-5 border-t border-[#e7e3da] flex justify-end gap-3">

          <RouterLink
            to="/admin/destinations"
            class="px-4 py-2.5 rounded-[10px] border border-[#e7e3da] bg-white text-sm text-[#1c2a22] hover:bg-[#f7f5f0] transition-colors duration-150"
          >
            Cancel
          </RouterLink>

          <button
            type="submit"
            :disabled="loading"
            class="px-5 py-2.5 rounded-[10px] bg-[#1f5c3f] text-white text-sm font-medium hover:bg-[#194d35] transition-colors duration-150"
          >
          {{ loading ? "Creating..." : "Create Destination" }}
        
          </button>

        </div>

      </form>
    </div>

  </div>
</template>