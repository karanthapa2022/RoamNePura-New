<script setup>
import { ref, computed, onMounted } from "vue";
import { getDestinations } from "../api/destinations";
import AppButton from '../components/ui/AppButton.vue'

const searchQuery = ref("");

const destinations = ref([]);
const loading = ref(false);
const error = ref("");

const fetchDestinations = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getDestinations();

    destinations.value = response.data;

    console.log("Public destinations:", response.data);
  } catch (err) {
    console.error(err);

    error.value =
      err.response?.data?.message ||
      "Unable to load destinations. Please try again.";
  } finally {
    loading.value = false;
  }
};

const filteredDestinations = computed(() => {
  return destinations.value.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

onMounted(() => {
  fetchDestinations();
});
</script>

<template>
  <section class="relative min-h-[60vh]">
    <img
      src="/images/IMG_6933.jpg"
      alt="Beautiful Landscape"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />

    <!--Dark Overlay-->
    <div class="absolute inset-0 bg-black/40"></div>
    <div
      class="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <p class="text-lg font-semibold text-white">Explore Nepal</p>
      <h1
        class="mt-2 text-4xl font-bold text-white md:text-6xl"
        style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45)"
      >
        Discover your Next Destination
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white">
        From peaceful valleys to breathtaking mountains, discover the places
        that make Nepal unforgettable.
      </p>
    </div>
  </section>

  <section class="px-6 py-16">
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-bold text-slate-800 md:text-4xl">
        Explore Destinations
      </h2>
      <p class="mt-3 max-w-2xl text-slate-600">
        Find the perfect destination for your next adventure in Nepal.
      </p>

      <div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search destinations..."
          class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-green-100"
        />
      </div>
    </div>
    <div class="mx-auto mt-10 max-w-6xl">
      <!-- Loading -->
      <div v-if="loading" class="py-16 text-center text-slate-500">
        Loading destinations...
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center text-red-600"
      >
        <p>{{ error }}</p>

        
<AppButton
    class="mt-3"
    variant="primary"
    @click="fetchDestinations"
>
    Try Again
</AppButton>
      </div>

      <!-- Empty -->
      <div
        v-else-if="destinations.length === 0"
        class="py-16 text-center text-slate-500"
      >
        No destinations available at the moment.
      </div>

      <!-- Destination Cards -->
      <div
        v-else-if="filteredDestinations.length > 0"
        class="grid gap-6 md:grid-cols-3"
      >
        <div
          v-for="destination in filteredDestinations"
          :key="destination.id"
          class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="h-56 overflow-hidden">
            <img
              :src="
                destination.image
                  ? `http://127.0.0.1:8000/storage/${destination.image}`
                  : '/images/IMG_6464.jpg'
              "
              :alt="destination.name"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="p-5">
            <h3 class="text-xl font-bold text-slate-800">
              {{ destination.name }}
            </h3>

            <p class="mt-2 text-slate-600">
              {{ destination.description }}
            </p>

            <RouterLink
              :to="`/destinations/${destination.slug}`"
              class="mt-4 inline-block font-semibold text-green-700 hover:text-green-800"
            >
              Explore →
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Search No Results -->
      <p v-else class="py-10 text-center text-slate-500">
        No destination found.
      </p>
    </div>
  </section>
</template>
