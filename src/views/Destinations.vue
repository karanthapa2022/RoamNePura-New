<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getDestinations } from "../api/destinations";

const destinations = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const error = ref("");

const API_ORIGIN = "http://127.0.0.1:8000";
const FALLBACK_IMAGE = "/images/IMG_6464.jpg";

function getDestinationImage(destination) {
  if (!destination.image) {
    return FALLBACK_IMAGE;
  }

  if (destination.image.startsWith("http")) {
    return destination.image;
  }

  const imagePath = destination.image.replace(/^\/+/, "");

  return `${API_ORIGIN}/storage/${imagePath}`;
}

const filteredDestinations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return destinations.value;
  }

  return destinations.value.filter((destination) => {
    return [
      destination.name,
      destination.location,
      destination.description,
      destination.highlights,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });
});

async function fetchDestinations() {
  loading.value = true;
  error.value = "";

  try {
    const response = await getDestinations();

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    destinations.value = data.filter(
      (destination) => Number(destination.is_published) === 1
    );
  } catch (err) {
    console.error("Failed to load destinations:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to load destinations. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDestinations);
</script>

<template>
  <main class="bg-[#f7f5ef] text-[#193d32]">

    <!-- Hero Section -->
    <section class="relative flex min-h-[65vh] items-center overflow-hidden">

      <img
        src="/images/IMG_6933.jpg"
        alt="Beautiful Nepal mountain landscape"
        class="absolute inset-0 h-full w-full object-cover"
      />

      <div class="absolute inset-0 bg-black/45"></div>

      <div class="relative z-10 mx-auto w-full max-w-7xl px-6 py-24">

        <div class="max-w-3xl text-white">

          <p class="mb-5 text-sm font-semibold uppercase tracking-[0.3em]">
            Explore Nepal
          </p>

          <h1 class="font-serif text-5xl leading-tight md:text-7xl">
            Find Your Next
            <span class="block italic">Adventure.</span>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-8 text-white/85 md:text-lg">
            From peaceful valleys to breathtaking Himalayan trails,
            discover the extraordinary places that make Nepal unforgettable.
          </p>

          <RouterLink
            to="/booking"
            class="mt-8 inline-flex rounded-full bg-[#e8bd83] px-8 py-4 font-semibold text-[#193d32] transition hover:bg-white"
          >
            Plan Your Journey
            <span class="ml-3">→</span>
          </RouterLink>

        </div>
      </div>
    </section>

    <!-- Destinations Section -->
    <section class="px-6 py-20 md:py-28">

      <div class="mx-auto max-w-7xl">

        <!-- Section Heading -->
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b4b]">
              Discover the beauty
            </p>

            <h2 class="mt-3 font-serif text-4xl md:text-5xl">
              Explore Destinations
            </h2>

            <p class="mt-4 max-w-xl leading-7 text-[#68756d]">
              Discover beautiful places, hidden trails and unforgettable
              experiences across Nepal.
            </p>
          </div>

          <p class="text-sm text-[#68756d]">
            {{ destinations.length }} destinations available
          </p>

        </div>

        <!-- Search -->
        <div class="mt-10 max-w-xl">

          <div class="flex items-center gap-3 rounded-full border border-[#e3dfd4] bg-white px-5 py-4 shadow-sm focus-within:border-[#193d32]">

            <span class="text-xl text-[#68756d]">⌕</span>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by destination, location or experience..."
              class="w-full bg-transparent text-sm text-[#193d32] outline-none placeholder:text-[#9ca59e]"
            />

            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="text-sm text-[#68756d] hover:text-[#193d32]"
            >
              Clear
            </button>

          </div>

        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="item in 3"
            :key="item"
            class="animate-pulse overflow-hidden rounded-2xl bg-white"
          >
            <div class="h-72 bg-[#e8e5dc]"></div>
            <div class="space-y-3 p-6">
              <div class="h-5 w-2/3 rounded bg-[#e8e5dc]"></div>
              <div class="h-4 w-full rounded bg-[#e8e5dc]"></div>
              <div class="h-4 w-1/2 rounded bg-[#e8e5dc]"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="mt-12 rounded-2xl border border-red-200 bg-red-50 p-10 text-center"
        >
          <p class="text-red-700">{{ error }}</p>

          <button
            @click="fetchDestinations"
            class="mt-5 rounded-full bg-[#193d32] px-7 py-3 font-semibold text-white transition hover:bg-[#285746]"
          >
            Try Again
          </button>
        </div>

        <!-- No Destinations -->
        <div
          v-else-if="destinations.length === 0"
          class="py-20 text-center"
        >
          <h3 class="font-serif text-2xl">
            No destinations available yet.
          </h3>

          <p class="mt-3 text-[#68756d]">
            Please check back later for new adventures.
          </p>
        </div>

        <!-- Destination Cards -->
        <div
          v-else-if="filteredDestinations.length > 0"
          class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >

          <article
            v-for="destination in filteredDestinations"
            :key="destination.id"
            class="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
          >

            <!-- Image -->
            <div class="relative h-72 overflow-hidden">

              <img
                :src="getDestinationImage(destination)"
                :alt="destination.name"
                @error="$event.target.src = FALLBACK_IMAGE"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              <span
                v-if="destination.duration"
                class="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#193d32] backdrop-blur"
              >
                {{ destination.duration }}
              </span>

            </div>

            <!-- Card Content -->
            <div class="p-6">

              <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a17b4b]">
                <span>📍</span>
                {{ destination.location || "Nepal" }}
              </div>

              <h3 class="mt-3 font-serif text-2xl text-[#193d32]">
                {{ destination.name }}
              </h3>

              <p class="mt-3 line-clamp-3 text-sm leading-7 text-[#68756d]">
                {{ destination.description }}
              </p>

              <div
                v-if="destination.best_time"
                class="mt-5 border-t border-[#eeeae1] pt-4"
              >
                <p class="text-xs text-[#8a938c]">
                  BEST TIME TO VISIT
                </p>

                <p class="mt-1 text-sm font-semibold text-[#193d32]">
                  {{ destination.best_time }}
                </p>
              </div>

              <RouterLink
                :to="`/destinations/${destination.slug}`"
                class="mt-6 inline-flex items-center font-semibold text-[#193d32] transition group-hover:text-[#a17b4b]"
              >
                Explore Destination
                <span class="ml-2 transition group-hover:translate-x-2">→</span>
              </RouterLink>

            </div>
          </article>

        </div>

        <!-- Search No Results -->
        <div
          v-else
          class="py-20 text-center"
        >
          <h3 class="font-serif text-2xl">
            No matching destinations found.
          </h3>

          <p class="mt-3 text-[#68756d]">
            Try searching with another destination or location.
          </p>

          <button
            @click="searchQuery = ''"
            class="mt-5 font-semibold text-[#a17b4b] hover:underline"
          >
            Clear Search
          </button>
        </div>

      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="px-6 pb-20">

      <div class="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#193d32] px-8 py-16 text-center text-white md:px-16">

        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#e8bd83]">
          Your next adventure awaits
        </p>

        <h2 class="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
          Nepal is waiting.
          <span class="italic">Let's explore it.</span>
        </h2>

        <p class="mx-auto mt-5 max-w-xl leading-7 text-white/70">
          Let us help you plan a journey filled with unforgettable
          landscapes, culture and experiences.
        </p>

        <RouterLink
          to="/booking"
          class="mt-8 inline-flex rounded-full bg-[#e8bd83] px-8 py-4 font-semibold text-[#193d32] transition hover:bg-white"
        >
          Start Your Journey →
        </RouterLink>

      </div>

    </section>

  </main>
</template>