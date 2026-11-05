
<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { createAdminTour } from "../../api/adminTours";

const router = useRouter();

const form = reactive({
  name: "",
  slug: "",
  description: "",
  duration: "",
  difficulty: "Moderate",
  price: "",
  category: "",
  highlights: "",
  is_published: false,
  image: null,
});

const loading = ref(false);
const error = ref("");
const validationErrors = ref({});

const generateSlug = () => {
  form.slug = form.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const handleImage = (event) => {
  form.image = event.target.files[0] || null;
};

const submitTour = async () => {
  loading.value = true;
  error.value = "";
  validationErrors.value = {};

  try {
    const data = new FormData();

    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("description", form.description);
    data.append("duration", form.duration);
    data.append("difficulty", form.difficulty);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("highlights", form.highlights);
    data.append("is_published", form.is_published ? "1" : "0");

    if (form.image) {
      data.append("image", form.image);
    }

    await createAdminTour(data);

    router.push("/admin/tours");
  } catch (err) {
    console.error("Create tour error:", err);

    if (err.response?.data?.errors) {
      validationErrors.value = err.response.data.errors;
      error.value = "Please correct the highlighted errors.";
    } else {
      error.value =
        err.response?.data?.message || "Unable to create tour.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-6">
      <button
        @click="router.push('/admin/tours')"
        class="mb-4 text-sm text-[#1f5c3f] hover:underline"
      >
        ← Back to Tours
      </button>

      <h2 class="font-serif text-3xl text-[#1c2a22]">
        Add New Tour
      </h2>

      <p class="mt-2 text-sm text-[#6b756e]">
        Create a new travel package for your website.
      </p>
    </div>

    <div
      v-if="error"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </div>

    <form
      @submit.prevent="submitTour"
      class="space-y-6 rounded-2xl border border-[#e7e3da] bg-white p-6"
    >
      <div>
        <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
          Tour Name *
        </label>
        <input
          v-model="form.name"
          @input="generateSlug"
          required
          class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
          placeholder="Everest Base Camp"
        />
        <p v-if="validationErrors.name" class="mt-1 text-xs text-red-600">
          {{ validationErrors.name[0] }}
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
          URL Slug *
        </label>
        <input
          v-model="form.slug"
          required
          class="w-full rounded-xl border border-[#e7e3da] bg-[#f7f5f0] px-4 py-3 text-sm outline-none"
          placeholder="everest-base-camp"
        />
        <p v-if="validationErrors.slug" class="mt-1 text-xs text-red-600">
          {{ validationErrors.slug[0] }}
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
          Description *
        </label>
        <textarea
          v-model="form.description"
          required
          rows="5"
          class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
          placeholder="Describe this tour..."
        ></textarea>
        <p v-if="validationErrors.description" class="mt-1 text-xs text-red-600">
          {{ validationErrors.description[0] }}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
            Duration *
          </label>
          <input
            v-model="form.duration"
            required
            class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
            placeholder="14 Days"
          />
          <p v-if="validationErrors.duration" class="mt-1 text-xs text-red-600">
            {{ validationErrors.duration[0] }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
            Difficulty *
          </label>
          <select
            v-model="form.difficulty"
            required
            class="w-full rounded-xl border border-[#e7e3da] bg-white px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Challenging</option>
            <option>Extreme</option>
          </select>
          <p v-if="validationErrors.difficulty" class="mt-1 text-xs text-red-600">
            {{ validationErrors.difficulty[0] }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
            Price (USD) *
          </label>
          <input
            v-model="form.price"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
            placeholder="1200"
          />
          <p v-if="validationErrors.price" class="mt-1 text-xs text-red-600">
            {{ validationErrors.price[0] }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
            Category
          </label>
          <input
            v-model="form.category"
            class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
            placeholder="Trekking"
          />
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
          Tour Image
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          @change="handleImage"
          class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm"
        />
        <p class="mt-1 text-xs text-[#6b756e]">
          JPG, PNG or WEBP. Maximum size: 2 MB.
        </p>
        <p v-if="validationErrors.image" class="mt-1 text-xs text-red-600">
          {{ validationErrors.image[0] }}
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-[#1c2a22]">
          Highlights
        </label>
        <textarea
          v-model="form.highlights"
          rows="3"
          class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 text-sm outline-none focus:border-[#1f5c3f]"
          placeholder="Mountain views, local culture, beautiful landscapes..."
        ></textarea>
      </div>

      <label class="flex items-center gap-3 text-sm text-[#1c2a22]">
        <input
          v-model="form.is_published"
          type="checkbox"
          class="h-4 w-4 accent-[#1f5c3f]"
        />
        Publish this tour immediately
      </label>

      <div class="flex flex-wrap gap-3 border-t border-[#e7e3da] pt-5">
        <button
          type="submit"
          :disabled="loading"
          class="rounded-xl bg-[#193b2b] px-6 py-3 text-sm font-medium text-white hover:bg-[#10271e] disabled:opacity-60"
        >
          {{ loading ? "Saving..." : "Create Tour" }}
        </button>

        <button
          type="button"
          @click="router.push('/admin/tours')"
          class="rounded-xl border border-[#e7e3da] px-6 py-3 text-sm text-[#1c2a22] hover:bg-[#f7f5f0]"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
