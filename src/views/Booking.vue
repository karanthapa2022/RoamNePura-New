<script setup>

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { getDestinations } from "../api/destinations";
import { createBooking } from "../services/bookingApi";
import { API_BASE, getStorageUrl } from "../config/api";

const route = useRoute();

const destinations = ref([]);
const availableTours = ref([]);
const destinationsLoading = ref(false);

const tours = {};

const initialSelection =
  route.query.destination ||
  tours[route.query.tour] ||
  "";

const selectedTour = ref(initialSelection);

const name = ref("");
const email = ref("");
const phone = ref("");
const travelDate = ref("");
const travelers = ref(1);
const message = ref("");

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const today = new Date();

const minimumDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

const destinationOptions = computed(() => {
  const names = destinations.value.map(
    destination => destination.name
  );

  availableTours.value.forEach(tour => {
    const linkedDestination = tour.destination;

    // Skip tours linked to unpublished destinations.
    if (
      linkedDestination &&
      Number(linkedDestination.is_published) !== 1
    ) {
      return;
    }

    // Skip tours already represented by a published destination.
    if (
      linkedDestination &&
      destinations.value.some(
        destination => destination.id === linkedDestination.id
      )
    ) {
      return;
    }

    names.push(tour.name);
  });

  return [...new Set(names.filter(Boolean))];
});

const selectedDestination = computed(() => {
  return destinations.value.find(
    (destination) => destination.name === selectedTour.value
  );
});

function destinationImage(destination) {
  if (!destination?.image) {
    return "/images/IMG_6464.jpg";
  }

  return getStorageUrl(destination.image);
}

async function fetchDestinations() {
  destinationsLoading.value = true;

  try {
    const response = await getDestinations();

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    destinations.value = data.filter(
      (destination) => Number(destination.is_published) === 1
    );
  } catch (error) {
    console.error("Unable to load destinations:", error);
  } finally {
    destinationsLoading.value = false;
  }
}


async function fetchTours() {
  try {
    const response = await axios.get(`${API_BASE}/tours`);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    availableTours.value = data;

    const tourSlug = route.query.tour;

    if (tourSlug && !route.query.destination) {
      const matchingTour = availableTours.value.find(
        (tour) => tour.slug === tourSlug
      );

      if (matchingTour) {
        const linkedDestination = matchingTour.destination;

        if (
          linkedDestination &&
          Number(linkedDestination.is_published) === 1
        ) {
          selectedTour.value = linkedDestination.name;
        } else if (!linkedDestination) {
          selectedTour.value = matchingTour.name;
        }
      }
    }
  } catch (error) {
    console.error("Unable to load tours:", error);
  }
}


async function submitBooking() {
  successMessage.value = "";
  errorMessage.value = "";

  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !phone.value.trim() ||
    !selectedTour.value ||
    !travelDate.value
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  if (travelDate.value < minimumDate) {
    errorMessage.value = "Please select a future travel date.";
    return;
  }

  if (!Number.isInteger(travelers.value)) {
  errorMessage.value = "Number of travelers must be a whole number.";
  return;
}

if (travelers.value < 1) {
  errorMessage.value = "Please enter at least one traveler.";
  return;
}

  loading.value = true;

  try {
    await createBooking({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      tour: selectedTour.value,
      travel_date: travelDate.value,
      travelers: travelers.value,
      message: message.value.trim(),
    });

    successMessage.value =
      "Your booking request has been submitted successfully! Our team will contact you soon.";

    name.value = "";
    email.value = "";
    phone.value = "";
    travelDate.value = "";
    travelers.value = 1;
    message.value = "";
    selectedTour.value = "";

  } catch (error) {
    console.error("Booking submission failed:", error);

    errorMessage.value =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDestinations();
  fetchTours();
});
</script>


<template>
  <main class="min-h-screen bg-[#f7f5ef] text-[#193d32]">

    <!-- Hero -->
    <section class="relative overflow-hidden px-6 py-20 md:py-28">

      <div class="mx-auto max-w-7xl">

        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#a17b4b]">
          Your journey begins here
        </p>

        <h1 class="mt-5 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
          Let's plan your
          <span class="italic">next adventure.</span>
        </h1>

        <p class="mt-6 max-w-2xl text-base leading-8 text-[#68756d] md:text-lg">
          Tell us a little about your travel plans. Our team will help
          you create a memorable experience in Nepal.
        </p>

      </div>
    </section>

    <!-- Booking Form -->
    <section class="px-6 pb-24">

      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_0.8fr]">

        <!-- Form -->
        <div class="rounded-3xl border border-[#e7e2d8] bg-white p-6 shadow-sm md:p-10">

          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#a17b4b]">
              Booking request
            </p>

            <h2 class="mt-3 font-serif text-3xl md:text-4xl">
              Tell us about yourself
            </h2>

            <p class="mt-3 text-sm leading-7 text-[#68756d]">
              Fill in the details below and we'll get in touch with you.
            </p>
          </div>

          <!-- Success -->
          <div
            v-if="successMessage"
            class="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm leading-7 text-green-800"
            role="status"
          >
            <p class="font-semibold">Booking request received!</p>
            <p class="mt-1">{{ successMessage }}</p>
          </div>

          <!-- Error -->
          <div
            v-if="errorMessage"
            class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            role="alert"
          >
            {{ errorMessage }}
          </div>

          <form
            @submit.prevent="submitBooking"
            class="mt-8 space-y-6"
          >

            <!-- Name -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Full Name <span class="text-red-500">*</span>
              </label>

              <input
                v-model="name"
                type="text"
                required
                autocomplete="name"
                placeholder="Enter your full name"
                class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
              />
            </div>

            <!-- Email and Phone -->
            <div class="grid gap-6 md:grid-cols-2">

              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Email Address <span class="text-red-500">*</span>
                </label>

                <input
                  v-model="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Phone Number <span class="text-red-500">*</span>
                </label>

                <input
                  v-model="phone"
                  type="tel"
                  required
                  autocomplete="tel"
                  placeholder="+977 98XXXXXXXX"
                  class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
                />
              </div>

            </div>

            <!-- Destination -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Choose Destination <span class="text-red-500">*</span>
              </label>

              <select
                v-model="selectedTour"
                required
                class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
              >
                <option value="" disabled>
                  {{ destinationsLoading ? "Loading destinations..." : "Select a destination" }}
                </option>

                <option
                  v-for="tour in destinationOptions"
                  :key="tour"
                  :value="tour"
                >
                  {{ tour }}
                </option>
              </select>

              <p class="mt-2 text-xs text-[#8a938c]">
                Choose the place you'd like to explore.
              </p>
            </div>

            <!-- Date and Travelers -->
            <div class="grid gap-6 md:grid-cols-2">

              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Preferred Travel Date <span class="text-red-500">*</span>
                </label>

                <input
                  v-model="travelDate"
                  type="date"
                  :min="minimumDate"
                  required
                  class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold">
                  Number of Travelers <span class="text-red-500">*</span>
                </label>

                <input
                  v-model.number="travelers"
                  type="number"
                  min="1"
                  step="1"
                  required
                  class="w-full rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
                />
              </div>

            </div>

            <!-- Message -->
            <div>
              <label class="mb-2 block text-sm font-semibold">
                Additional Message
              </label>

              <textarea
                v-model="message"
                rows="5"
                placeholder="Tell us about your preferences, questions or special requirements..."
                class="w-full resize-none rounded-xl border border-[#dedfd7] bg-[#fcfbf8] px-4 py-3.5 outline-none transition focus:border-[#193d32] focus:ring-2 focus:ring-[#193d32]/10"
              ></textarea>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-full bg-[#193d32] px-8 py-4 font-semibold text-white transition hover:bg-[#285746] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading ? "Submitting Your Request..." : "Submit Booking Request →" }}
            </button>

            <p class="text-center text-xs leading-6 text-[#8a938c]">
              This is a booking inquiry. Your trip is not confirmed
              until our team contacts you.
            </p>

          </form>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-6">

          <!-- Selected Destination -->
          <div class="overflow-hidden rounded-3xl border border-[#e7e2d8] bg-white shadow-sm">

            <template v-if="selectedDestination">

              <img
                :src="destinationImage(selectedDestination)"
                :alt="selectedDestination.name"
                @error="$event.target.src = '/images/IMG_6464.jpg'"
                class="h-56 w-full object-cover"
              />

            </template>

            <div class="p-7">

              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#a17b4b]">
                Your adventure
              </p>

              <h2 class="mt-3 font-serif text-2xl">
                {{ selectedTour || "Choose your destination" }}
              </h2>

              <template v-if="selectedDestination">

                <p class="mt-3 text-sm text-[#68756d]">
                  📍 {{ selectedDestination.location || "Nepal" }}
                </p>

                <p
                  v-if="selectedDestination.duration"
                  class="mt-2 text-sm text-[#68756d]"
                >
                  🕐 {{ selectedDestination.duration }}
                </p>

                <p
                  v-if="selectedDestination.best_time"
                  class="mt-2 text-sm text-[#68756d]"
                >
                  ☀️ Best time: {{ selectedDestination.best_time }}
                </p>

              </template>

              <div class="mt-6 rounded-2xl bg-[#f7f5ef] p-5">

                <p class="text-sm leading-7 text-[#68756d]">
                  Submit your details and our team will contact you
                  to discuss availability, pricing and your travel plans.
                </p>

              </div>

            </div>
          </div>

          <!-- Why Book With Us -->
          <div class="rounded-3xl bg-[#193d32] p-7 text-white">

            <h3 class="font-serif text-2xl">
              Why travel with RoamNePura?
            </h3>

            <div class="mt-7 space-y-5">

              <div class="flex gap-4">
                <span class="text-xl">🏔️</span>
                <div>
                  <p class="font-semibold">Discover Nepal</p>
                  <p class="mt-1 text-sm leading-6 text-white/65">
                    Explore beautiful destinations and memorable experiences.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <span class="text-xl">🤝</span>
                <div>
                  <p class="font-semibold">Personal Assistance</p>
                  <p class="mt-1 text-sm leading-6 text-white/65">
                    Our team helps you plan your journey.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <span class="text-xl">✈️</span>
                <div>
                  <p class="font-semibold">Flexible Travel Plans</p>
                  <p class="mt-1 text-sm leading-6 text-white/65">
                    Share your preferences and travel requirements.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </aside>

      </div>
    </section>

  </main>
</template>
