
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppButton from '../../../components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()

const tour = ref(null)
const loading = ref(true)
const error = ref('')
const activeImage = ref('')

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const getImageUrl = (image) => {
  if (!image) return '/images/IMG_6933.jpg'
  if (image.startsWith('http')) return image
  return `http://127.0.0.1:8000/storage/${image}`
}

const galleryImages = computed(() => {
  if (!tour.value) return []

  const images = [
    tour.value.image,
    ...(tour.value.gallery_images || [])
  ].filter(Boolean)

  return [...new Set(images)]
})

const fetchTour = async () => {
  loading.value = true
  error.value = ''
  tour.value = null

  try {
    const response = await axios.get(
      `${API_BASE}/tours/${route.params.slug}`
    )

    tour.value = response.data
    activeImage.value = tour.value.image || ''
  } catch (err) {
    console.error('Fetch tour details error:', err)
    error.value =
      err.response?.status === 404
        ? 'This tour could not be found or is no longer available.'
        : 'Unable to load this tour. Please try again.'
  } finally {
    loading.value = false
  }
}

const bookTour = () => {
  if (!tour.value) return

  router.push({
    path: '/booking',
    query: { tour: tour.value.slug }
  })
}

const formatPrice = (price) => {
  return `From $${Number(price || 0).toLocaleString()}`
}

watch(
  () => route.params.slug,
  fetchTour,
  { immediate: true }
)
</script>

<template>
  <main class="min-h-screen bg-[#f8f7f2]">

    <!-- Loading -->
    <section
      v-if="loading"
      class="px-6 py-32 text-center"
    >
      <p class="text-slate-500">Loading tour details...</p>
    </section>

    <!-- Error -->
    <section
      v-else-if="error"
      class="px-6 py-32 text-center"
    >
      <h1 class="font-serif text-3xl text-[#193b2b]">
        Tour Unavailable
      </h1>

      <p class="mt-4 text-red-600">{{ error }}</p>

      <RouterLink
        to="/tours"
        class="mt-8 inline-block rounded-full bg-[#193b2b] px-7 py-3 text-white"
      >
        Back to Tours
      </RouterLink>
    </section>

    <!-- Tour Details -->
    <template v-else-if="tour">

      <!-- Hero -->
      <section class="relative flex min-h-[55vh] items-end overflow-hidden">
        <img
          :src="getImageUrl(tour.image)"
          :alt="tour.name"
          class="absolute inset-0 h-full w-full object-cover"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-[#10271e]/90 via-black/30 to-black/20"></div>

        <div class="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
          <RouterLink
            to="/tours"
            class="inline-block text-sm font-medium text-white/80 transition hover:text-[#dfc99d]"
          >
            ← Back to all tours
          </RouterLink>

          <p class="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-[#dfc99d]">
            {{ tour.category || 'Explore Nepal' }}
          </p>

          <h1 class="mt-4 max-w-4xl font-serif text-4xl leading-tight text-white md:text-6xl">
            {{ tour.name }}
          </h1>

          <div class="mt-6 flex flex-wrap gap-3">
            <span class="rounded-full bg-white/15 px-5 py-2 text-sm text-white backdrop-blur">
              {{ tour.duration }}
            </span>

            <span class="rounded-full bg-white/15 px-5 py-2 text-sm text-white backdrop-blur">
              {{ tour.difficulty }}
            </span>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="px-5 py-16 md:px-8 md:py-24">
        <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_340px]">

          <div>

            <!-- Gallery -->
            <div v-if="galleryImages.length">
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
                Discover the Experience
              </p>

              <h2 class="mt-3 font-serif text-3xl text-[#193b2b]">
                Tour Gallery
              </h2>

              <div class="mt-6 overflow-hidden rounded-3xl">
                <img
                  :src="getImageUrl(activeImage)"
                  :alt="tour.name"
                  class="h-[350px] w-full object-cover md:h-[480px]"
                />
              </div>

              <div
                v-if="galleryImages.length > 1"
                class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4"
              >
                <button
                  v-for="(image, index) in galleryImages"
                  :key="image"
                  type="button"
                  @click="activeImage = image"
                  class="overflow-hidden rounded-xl"
                  :class="activeImage === image ? 'ring-2 ring-[#193b2b] ring-offset-2' : ''"
                >
                  <img
                    :src="getImageUrl(image)"
                    :alt="`${tour.name} gallery image ${index + 1}`"
                    class="h-24 w-full object-cover transition hover:scale-105"
                  />
                </button>
              </div>
            </div>

            <!-- Overview -->
            <div class="mt-14">
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
                About This Journey
              </p>

              <h2 class="mt-3 font-serif text-3xl text-[#193b2b]">
                Tour Overview
              </h2>

              <p class="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {{ tour.description }}
              </p>
            </div>

            <!-- Highlights -->
            <div v-if="tour.highlights" class="mt-14">
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
                What Makes It Special
              </p>

              <h2 class="mt-3 font-serif text-3xl text-[#193b2b]">
                Tour Highlights
              </h2>

              <ul class="mt-6 grid gap-4 sm:grid-cols-2">
                <li
                  v-for="(highlight, index) in (Array.isArray(tour.highlights) ? tour.highlights : tour.highlights.split('\n').filter(Boolean))"
                  :key="index"
                  class="flex items-start gap-3 rounded-2xl bg-white p-5"
                >
                  <span class="text-[#9b8051]">✦</span>
                  <span class="text-sm leading-6 text-slate-600">
                    {{ highlight }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Itinerary -->
            <div v-if="tour.itinerary?.length" class="mt-14">
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
                Your Travel Plan
              </p>

              <h2 class="mt-3 font-serif text-3xl text-[#193b2b]">
                Tour Itinerary
              </h2>

              <div class="mt-8 space-y-5">
                <article
                  v-for="(day, index) in tour.itinerary"
                  :key="index"
                  class="rounded-2xl border border-[#e9e6dc] bg-white p-6"
                >
                  <p class="text-xs font-bold uppercase tracking-wider text-[#9b8051]">
                    {{ day.day || `Day ${index + 1}` }}
                  </p>

                  <h3 class="mt-2 font-serif text-xl text-[#193b2b]">
                    {{ day.title }}
                  </h3>

                  <p class="mt-3 text-sm leading-7 text-slate-600">
                    {{ day.description }}
                  </p>
                </article>
              </div>
            </div>

          </div>

          <!-- Booking Card -->
          <aside>
            <div class="sticky top-28 rounded-3xl border border-[#e9e6dc] bg-white p-7 shadow-sm">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#9b8051]">
                Start Your Adventure
              </p>

              <p class="mt-4 text-sm text-slate-500">
                Starting price
              </p>

              <p class="mt-1 font-serif text-3xl text-[#193b2b]">
                {{ formatPrice(tour.price) }}
              </p>

              <div class="my-7 space-y-4 border-y border-[#eeeae1] py-6">
                <div class="flex justify-between gap-4 text-sm">
                  <span class="text-slate-500">Duration</span>
                  <span class="font-semibold text-[#193b2b]">{{ tour.duration }}</span>
                </div>

                <div class="flex justify-between gap-4 text-sm">
                  <span class="text-slate-500">Difficulty</span>
                  <span class="font-semibold text-[#193b2b]">{{ tour.difficulty }}</span>
                </div>

                <div class="flex justify-between gap-4 text-sm">
                  <span class="text-slate-500">Category</span>
                  <span class="font-semibold text-[#193b2b]">{{ tour.category || 'Adventure' }}</span>
                </div>
              </div>

              <AppButton
                variant="primary"
                class="w-full"
                @click="bookTour"
              >
                Book This Tour →
              </AppButton>

              <RouterLink
                to="/contact"
                class="mt-4 block text-center text-sm font-semibold text-[#55745c] hover:text-[#9b8051]"
              >
                Have questions? Contact us
              </RouterLink>
            </div>
          </aside>

        </div>
      </section>

    </template>
  </main>
</template>
