<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getAdminTour,
  createAdminTour,
  updateAdminTour,
} from "../../api/adminTours";

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => Boolean(route.params.id));

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const coverImage = ref(null);
const coverPreview = ref("");

const galleryFiles = ref([]);
const galleryPreviews = ref([]);

const existingGallery = ref([]);

const form = ref({
  name: "",
  slug: "",
  description: "",
  duration: "",
  difficulty: "Moderate",
  price: "",
  category: "",
  highlights: "",
  itinerary: [
    { day: "Day 1", title: "", description: "" },
  ],
  is_published: false,
});

const API_STORAGE = "http://127.0.0.1:8000/storage/";

const getImageUrl = (image) => {
  if (!image) return "";

  return image.startsWith("http")
    ? image
    : `${API_STORAGE}${image}`;
};

const makeSlug = () => {
  form.value.slug = form.value.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const selectCover = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  coverImage.value = file;
  coverPreview.value = URL.createObjectURL(file);
};

const selectGallery = (event) => {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    galleryFiles.value.push(file);
    galleryPreviews.value.push(URL.createObjectURL(file));
  });

  event.target.value = "";
};

const removeGalleryImage = (index) => {
  URL.revokeObjectURL(galleryPreviews.value[index]);

  galleryFiles.value.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
};

const addItineraryDay = () => {
  form.value.itinerary.push({
    day: `Day ${form.value.itinerary.length + 1}`,
    title: "",
    description: "",
  });
};

const removeItineraryDay = (index) => {
  form.value.itinerary.splice(index, 1);
};

const loadTour = async () => {
  if (!isEditing.value) return;

  loading.value = true;
  error.value = "";

  try {
    const response = await getAdminTour(route.params.id);
    const tour = response.data;

    form.value = {
      name: tour.name || "",
      slug: tour.slug || "",
      description: tour.description || "",
      duration: tour.duration || "",
      difficulty: tour.difficulty || "Moderate",
      price: tour.price || "",
      category: tour.category || "",
      highlights: tour.highlights || "",
      itinerary: Array.isArray(tour.itinerary) && tour.itinerary.length
        ? tour.itinerary
        : [{ day: "Day 1", title: "", description: "" }],
      is_published: Boolean(tour.is_published),
    };

    existingGallery.value = tour.gallery_images || [];

    if (tour.image) {
      coverPreview.value = getImageUrl(tour.image);
    }
  } catch (err) {
    console.error("Load tour error:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to load tour details.";
  } finally {
    loading.value = false;
  }
};

const submitTour = async () => {
  error.value = "";

  if (!form.value.name.trim() || !form.value.slug.trim()) {
    error.value = "Tour name and slug are required.";
    return;
  }

  saving.value = true;

  try {
    const data = new FormData();

    data.append("name", form.value.name);
    data.append("slug", form.value.slug);
    data.append("description", form.value.description);
    data.append("duration", form.value.duration);
    data.append("difficulty", form.value.difficulty);
    data.append("price", form.value.price);
    data.append("category", form.value.category || "");
    data.append("highlights", form.value.highlights || "");
    data.append("is_published", form.value.is_published ? "1" : "0");

    // Send itinerary as Laravel-compatible nested fields.
    form.value.itinerary.forEach((item, index) => {
      data.append(`itinerary[${index}][day]`, item.day || "");
      data.append(`itinerary[${index}][title]`, item.title || "");
      data.append(
        `itinerary[${index}][description]`,
        item.description || ""
      );
    });

    if (coverImage.value) {
      data.append("image", coverImage.value);
    }

    galleryFiles.value.forEach((file) => {
      data.append("gallery_images[]", file);
    });

    if (isEditing.value) {
      await updateAdminTour(route.params.id, data);
    } else {
      await createAdminTour(data);
    }

    router.push("/admin/tours");
  } catch (err) {
    console.error("Save tour error:", err);

    if (err.response?.data?.errors) {
      error.value = Object.values(err.response.data.errors)
        .flat()
        .join(" ");
    } else {
      error.value =
        err.response?.data?.message ||
        "Unable to save tour. Please try again.";
    }
  } finally {
    saving.value = false;
  }
};

onMounted(loadTour);
</script>

<template>
  <div>
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-3xl text-[#193b2b]">
          {{ isEditing ? "Edit Tour" : "Add New Tour" }}
        </h2>

        <p class="mt-2 text-sm text-[#6b756e]">
          Add tour information, photographs and travel details.
        </p>
      </div>

      <button
        type="button"
        @click="router.push('/admin/tours')"
        class="rounded-xl border border-[#e7e3da] bg-white px-5 py-3 text-sm text-[#193b2b]"
      >
        ← Back to Tours
      </button>
    </div>

    <div
      v-if="loading"
      class="rounded-xl border border-[#e7e3da] bg-white p-10 text-center text-[#6b756e]"
    >
      Loading tour...
    </div>

    <form v-else @submit.prevent="submitTour" class="space-y-8">

      <div
        v-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
      >
        {{ error }}
      </div>

      <!-- Basic Information -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <h3 class="font-serif text-2xl text-[#193b2b]">
          Basic Information
        </h3>

        <div class="mt-6 grid gap-5 md:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              Tour Name *
            </span>

            <input
              v-model="form.name"
              @input="makeSlug"
              required
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
              placeholder="Everest Base Camp"
            />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              URL Slug *
            </span>

            <input
              v-model="form.slug"
              required
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
              placeholder="everest-base-camp"
            />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              Duration *
            </span>

            <input
              v-model="form.duration"
              required
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
              placeholder="14 Days"
            />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              Difficulty *
            </span>

            <select
              v-model="form.difficulty"
              required
              class="w-full rounded-xl border border-[#e7e3da] bg-white px-4 py-3 outline-none focus:border-[#55745c]"
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
              <option>Very Challenging</option>
            </select>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              Price (USD) *
            </span>

            <input
              v-model="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
              placeholder="1200"
            />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-[#193b2b]">
              Category
            </span>

            <input
              v-model="form.category"
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
              placeholder="Trekking"
            />
          </label>
        </div>

        <label class="mt-5 block">
          <span class="mb-2 block text-sm font-medium text-[#193b2b]">
            Detailed Tour Description *
          </span>

          <textarea
            v-model="form.description"
            rows="6"
            required
            class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
            placeholder="Describe the destination, experience, landscapes, culture and what visitors can expect..."
          ></textarea>
        </label>
      </section>

      <!-- Cover Image -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <h3 class="font-serif text-2xl text-[#193b2b]">
          Cover Image
        </h3>

        <p class="mt-2 text-sm text-[#6b756e]">
          This is the main photograph displayed on the tour card and details page.
        </p>

        <div v-if="coverPreview" class="mt-5">
          <img
            :src="coverPreview"
            alt="Tour cover preview"
            class="h-64 w-full rounded-xl object-cover md:w-96"
          />
        </div>

        <label class="mt-5 block">
          <span class="mb-2 block text-sm font-medium text-[#193b2b]">
            {{ coverImage ? "Choose another cover image" : "Upload cover image" }}
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="selectCover"
            class="block w-full text-sm text-[#6b756e] file:mr-4 file:rounded-lg file:border-0 file:bg-[#edf1eb] file:px-4 file:py-2 file:font-medium file:text-[#193b2b]"
          />
        </label>

        <p class="mt-2 text-xs text-[#8a918b]">
          Maximum file size: 2 MB.
        </p>
      </section>

      <!-- Gallery -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <h3 class="font-serif text-2xl text-[#193b2b]">
          Tour Photo Gallery
        </h3>

        <p class="mt-2 text-sm text-[#6b756e]">
          Upload multiple photographs of mountains, villages, landscapes and experiences.
        </p>

        <div
          v-if="existingGallery.length"
          class="mt-5"
        >
          <p class="mb-3 text-sm font-medium text-[#193b2b]">
            Existing gallery images
          </p>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <img
              v-for="(image, index) in existingGallery"
              :key="index"
              :src="getImageUrl(image)"
              alt="Existing tour gallery image"
              class="h-32 w-full rounded-xl object-cover"
            />
          </div>

          <p class="mt-3 text-xs text-[#8a918b]">
            Existing images are kept when you upload additional images.
          </p>
        </div>

        <div
          v-if="galleryPreviews.length"
          class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="(preview, index) in galleryPreviews"
            :key="preview"
            class="relative"
          >
            <img
              :src="preview"
              alt="New gallery preview"
              class="h-32 w-full rounded-xl object-cover"
            />

            <button
              type="button"
              @click="removeGalleryImage(index)"
              class="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
            >
              Remove
            </button>
          </div>
        </div>

        <label class="mt-5 block">
          <span class="mb-2 block text-sm font-medium text-[#193b2b]">
            Upload gallery photographs
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            @change="selectGallery"
            class="block w-full text-sm text-[#6b756e] file:mr-4 file:rounded-lg file:border-0 file:bg-[#edf1eb] file:px-4 file:py-2 file:font-medium file:text-[#193b2b]"
          />
        </label>

        <p class="mt-2 text-xs text-[#8a918b]">
          You can select multiple images. Each image must be 2 MB or smaller.
        </p>
      </section>

      <!-- Highlights -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <h3 class="font-serif text-2xl text-[#193b2b]">
          Tour Highlights
        </h3>

        <p class="mt-2 text-sm text-[#6b756e]">
          Add the most important attractions and experiences.
        </p>

        <textarea
          v-model="form.highlights"
          rows="5"
          class="mt-5 w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none focus:border-[#55745c]"
          placeholder="Mountain views&#10;Traditional villages&#10;Local culture&#10;Beautiful landscapes"
        ></textarea>

        <p class="mt-2 text-xs text-[#8a918b]">
          Add one highlight per line.
        </p>
      </section>

      <!-- Itinerary -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-serif text-2xl text-[#193b2b]">
              Day-by-Day Itinerary
            </h3>

            <p class="mt-2 text-sm text-[#6b756e]">
              Explain what visitors will do each day.
            </p>
          </div>

          <button
            type="button"
            @click="addItineraryDay"
            class="rounded-lg bg-[#edf1eb] px-4 py-2 text-sm font-semibold text-[#193b2b]"
          >
            + Add Day
          </button>
        </div>

        <div
          v-for="(item, index) in form.itinerary"
          :key="index"
          class="mt-6 rounded-xl border border-[#e7e3da] p-5"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-[#193b2b]">
              {{ item.day || `Day ${index + 1}` }}
            </h4>

            <button
              v-if="form.itinerary.length > 1"
              type="button"
              @click="removeItineraryDay(index)"
              class="text-sm text-red-600"
            >
              Remove
            </button>
          </div>

          <label class="mt-4 block">
            <span class="mb-2 block text-sm text-[#193b2b]">
              Day label
            </span>

            <input
              v-model="item.day"
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none"
              :placeholder="`Day ${index + 1}`"
            />
          </label>

          <label class="mt-4 block">
            <span class="mb-2 block text-sm text-[#193b2b]">
              Title
            </span>

            <input
              v-model="item.title"
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none"
              placeholder="Arrival in Kathmandu"
            />
          </label>

          <label class="mt-4 block">
            <span class="mb-2 block text-sm text-[#193b2b]">
              Description
            </span>

            <textarea
              v-model="item.description"
              rows="3"
              class="w-full rounded-xl border border-[#e7e3da] px-4 py-3 outline-none"
              placeholder="Describe the activities and places visited..."
            ></textarea>
          </label>
        </div>
      </section>

      <!-- Publishing -->
      <section class="rounded-2xl border border-[#e7e3da] bg-white p-6">
        <h3 class="font-serif text-2xl text-[#193b2b]">
          Publishing
        </h3>

        <label class="mt-5 flex items-center gap-3 text-sm text-[#193b2b]">
          <input
            v-model="form.is_published"
            type="checkbox"
            class="h-4 w-4 accent-[#193b2b]"
          />

          Publish this tour immediately
        </label>
      </section>

      <!-- Submit -->
      <div class="flex flex-wrap gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="rounded-xl bg-[#193b2b] px-7 py-3 font-semibold text-white transition hover:bg-[#10271e] disabled:opacity-60"
        >
          {{
            saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Tour"
          }}
        </button>

        <button
          type="button"
          @click="router.push('/admin/tours')"
          class="rounded-xl border border-[#e7e3da] bg-white px-7 py-3 font-semibold text-[#193b2b]"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
