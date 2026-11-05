
<script setup>
import { ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { getDestination } from "../../../api/destinations";

const route = useRoute();

const destination = ref(null);
const loading = ref(false);
const error = ref("");

const API_ORIGIN = "http://127.0.0.1:8000";
const FALLBACK_IMAGE = "/images/IMG_6464.jpg";

function getDestinationImage() {
  if (!destination.value?.image) {
    return FALLBACK_IMAGE;
  }

  if (destination.value.image.startsWith("http")) {
    return destination.value.image;
  }

  const imagePath = destination.value.image.replace(/^\/+/, "");

  return `${API_ORIGIN}/storage/${imagePath}`;
}

async function fetchDestination() {
  loading.value = true;
  error.value = "";
  destination.value = null;

  try {
    const response = await getDestination(route.params.slug);
    destination.value = response.data;
  } catch (err) {
    console.error("Failed to load destination:", err);

    error.value =
      err.response?.data?.message ||
      "Unable to load this destination. Please try again.";
  } finally {
    loading.value = false;
  }
}

// Also fetch when the slug changes without reloading the page.
watch(
  () => route.params.slug,
  () => fetchDestination(),
  { immediate: true }
);
</script>

<template>
  <main class="min-h-screen bg-[#f7f5ef] text-[#193d32]">

    <!-- Loading -->
    <section
      v-if="loading"
      class="flex min-h-[65vh] items-center justify-center px-6"
    >
      <div class="text-center">
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#d9dfd7] border-t-[#193d32]"></div>
        <p class="mt-5 text-[#68756d]">Discovering your destination...</p>
      </div>
    </section>

    <!-- Error -->
    <section
      v-else-if="error"
      class="flex min-h-[65vh] items-center justify-center px-6"
    >
      <div class="max-w-lg text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#a17b4b]">
          Something went wrong
        </p>

        <h1 class="mt-4 font-serif text-3xl">
          Destination unavailable
        </h1>

        <p class="mt-4 leading-7 text-[#68756d]">
          {{ error }}
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button
            @click="fetchDestination"
            class="rounded-full bg-[#193d32] px-7 py-3 font-semibold text-white transition hover:bg-[#285746]"
          >
            Try Again
          </button>

          <RouterLink
            to="/destinations"
            class="rounded-full border border-[#193d32] px-7 py-3 font-semibold transition hover:bg-[#193d32] hover:text-white"
          >
            Back to Destinations
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Destination Content -->
    <template v-else-if="destination">

      <!-- Hero -->
      <section class="relative flex min-h-[65vh] items-end overflow-hidden md:min-h-[75vh]">

        <img
          :src="getDestinationImage()"
          :alt="destination.name"
          @error="$event.target.src = FALLBACK_IMAGE"
          class="absolute inset-0 h-full w-full object-cover"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>

        <div class="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-32 md:pb-20">

          <RouterLink
            to="/destinations"
            class="mb-10 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white hover:text-[#193d32]"
          >
            <span>←</span>
            All Destinations
          </RouterLink>

          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#e8bd83]">
            Discover Nepal
          </p>

          <h1 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-7xl">
            {{ destination.name }}
          </h1>

          <p
            v-if="destination.location"
            class="mt-5 text-base text-white/85 md:text-lg"
          >
            📍 {{ destination.location }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">

            <span
              v-if="destination.duration"
              class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur"
            >
              {{ destination.duration }}
            </span>

            <span
              v-if="destination.best_time"
              class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur"
            >
              Best time: {{ destination.best_time }}
            </span>

          </div>

        </div>
      </section>

      <!-- Main Information -->
      <section class="px-6 py-20 md:py-28">

        <div class="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.5fr_0.8fr]">

          <!-- About -->
          <div>

            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b4b]">
              Get to know this place
            </p>

            <h2 class="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Discover the beauty of
              <span class="italic">{{ destination.name }}.</span>
            </h2>

            <p class="mt-7 text-base leading-8 text-[#68756d] md:text-lg">
              {{ destination.description }}
            </p>

            <!-- Highlights -->
            <div class="mt-14">

              <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b4b]">
                Experiences to remember
              </p>

              <h3 class="mt-3 font-serif text-3xl">
                Destination Highlights
              </h3>

              <p
                v-if="destination.highlights"
                class="mt-5 whitespace-pre-line text-base leading-8 text-[#68756d]"
              >
                {{ destination.highlights }}
              </p>

              <p
                v-else
                class="mt-5 text-[#68756d]"
              >
                More destination highlights will be added soon.
              </p>

            </div>

          </div>

          <!-- Information Cards -->
          <aside class="space-y-5">

            <div class="rounded-3xl border border-[#e7e2d8] bg-white p-7 shadow-sm">

              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#a17b4b]">
                Trip Information
              </p>

              <!-- Location -->
              <div class="mt-8 flex gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1e9] text-xl">
                  📍
                </div>

                <div>
                  <p class="text-sm text-[#8a938c]">Location</p>
                  <p class="mt-1 font-semibold">
                    {{ destination.location || "Not specified" }}
                  </p>
                </div>
              </div>

              <div class="my-6 border-t border-[#eeeae1]"></div>

              <!-- Duration -->
              <div class="flex gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1e9] text-xl">
                  🕐
                </div>

                <div>
                  <p class="text-sm text-[#8a938c]">Trip Duration</p>
                  <p class="mt-1 font-semibold">
                    {{ destination.duration || "Not specified" }}
                  </p>
                </div>
              </div>

              <div class="my-6 border-t border-[#eeeae1]"></div>

              <!-- Best Time -->
              <div class="flex gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1e9] text-xl">
                  ☀️
                </div>

                <div>
                  <p class="text-sm text-[#8a938c]">Best Time to Visit</p>
                  <p class="mt-1 font-semibold">
                    {{ destination.best_time || "Not specified" }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Contact Card -->
            <div class="rounded-3xl bg-[#193d32] p-7 text-white">

              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8bd83]">
                Your adventure starts here
              </p>

              <h3 class="mt-4 font-serif text-3xl leading-tight">
                Ready to explore {{ destination.name }}?
              </h3>

              <p class="mt-4 text-sm leading-7 text-white/70">
                Have questions or want to plan your trip?
                Talk to our team and let's create an unforgettable journey.
              </p>

              <RouterLink
                :to="{
                  path: '/contact',
                  query: { destination: destination.name }
                }"
                class="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#e8bd83] px-6 py-4 font-semibold text-[#193d32] transition hover:bg-white"
              >
                Plan Your Trip →
              </RouterLink>

            </div>

          </aside>

        </div>

      </section>

      <!-- Bottom Banner -->
      <section class="px-6 pb-20">

        <div class="mx-auto max-w-7xl rounded-3xl border border-[#e7e2d8] bg-white px-8 py-12 text-center md:px-16 md:py-16">

          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b4b]">
            More places to discover
          </p>

          <h2 class="mt-4 font-serif text-4xl md:text-5xl">
            Keep exploring Nepal.
          </h2>

          <p class="mx-auto mt-5 max-w-xl leading-7 text-[#68756d]">
            There is always another beautiful destination waiting
            to become part of your story.
          </p>

          <RouterLink
            to="/destinations"
            class="mt-8 inline-flex rounded-full bg-[#193d32] px-8 py-4 font-semibold text-white transition hover:bg-[#285746]"
          >
            Explore More Destinations →
          </RouterLink>

        </div>

      </section>

    </template>

  </main>
</template>
