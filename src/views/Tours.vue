
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AppButton from '../components/ui/AppButton.vue'

const searchQuery = ref('')
const tours = ref([])
const loading = ref(true)
const error = ref('')

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const fetchTours = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(`${API_BASE}/tours`)
    tours.value = response.data
  } catch (err) {
    console.error('Fetch tours error:', err)
    error.value = 'Unable to load tours. Please try again.'
  } finally {
    loading.value = false
  }
}

const getImageUrl = (image) => {
  if (!image) return '/images/IMG_6933.jpg'

  if (image.startsWith('http')) return image

  return `http://127.0.0.1:8000/storage/${image}`
}

const formatPrice = (price) => {
  return `From $${Number(price).toLocaleString()}`
}

const filteredTours = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return tours.value

  return tours.value.filter(tour =>
    [
      tour.name,
      tour.description,
      tour.difficulty,
      tour.duration,
      tour.category,
      tour.highlights
    ]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(query))
  )
})

const scrollToTours = () => {
  document.getElementById('explore-tours')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

onMounted(fetchTours)
</script>

<template>
  <main class="bg-[#f8f7f2]">

    <!-- Hero -->
    <section class="relative flex min-h-[65vh] items-center justify-center overflow-hidden">
      <img
        src="/images/IMG_6933.jpg"
        alt="Himalayan mountains in Nepal"
        class="absolute inset-0 h-full w-full object-cover"
      />

      <div class="absolute inset-0 bg-[#10271e]/60"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.35em] text-[#dfc99d] md:text-sm">
          Explore With RoamNePura
        </p>

        <h1 class="mt-6 font-serif text-5xl font-medium leading-tight text-white md:text-7xl">
          Find Your Perfect
          <span class="block italic text-[#dfc99d]">
            Adventure
          </span>
        </h1>

        <p class="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
          From legendary Himalayan treks to culturally rich destinations,
          discover experiences that make your journey through Nepal unforgettable.
        </p>

        <button
          type="button"
          @click="scrollToTours"
          class="mt-9 inline-flex rounded-full border border-white/70 px-8 py-3.5 font-semibold text-white transition hover:bg-white hover:text-[#193b2b]"
        >
          Explore Our Tours ↓
        </button>
      </div>
    </section>

    <!-- Tours -->
    <section id="explore-tours" class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-6xl">

        <!-- Heading -->
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
              Discover Your Next Journey
            </p>

            <h2 class="mt-4 font-serif text-4xl text-[#193b2b] md:text-5xl">
              Explore Our Tours
            </h2>

            <p class="mt-4 max-w-xl leading-8 text-slate-600">
              Find an adventure that matches your interests, travel style,
              and sense of exploration.
            </p>
          </div>

          <p class="text-sm text-slate-500">
            {{ filteredTours.length }}
            {{ filteredTours.length === 1 ? 'tour' : 'tours' }} available
          </p>
        </div>

        <!-- Search -->
        <div class="mt-10">
          <div class="relative max-w-xl">
            <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400">
              ⌕
            </span>

            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search by destination, activity or difficulty..."
              aria-label="Search tours"
              class="w-full rounded-full border border-[#e5e2d8] bg-white py-4 pl-14 pr-6 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
            />
          </div>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="mt-12 rounded-3xl border border-[#e9e6dc] bg-white px-6 py-16 text-center"
        >
          <p class="text-sm text-slate-500">
            Loading our tours...
          </p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="mt-12 rounded-3xl border border-red-200 bg-white px-6 py-16 text-center"
        >
          <h3 class="font-serif text-2xl text-[#193b2b]">
            Unable to Load Tours
          </h3>

          <p class="mt-3 text-sm text-red-600">
            {{ error }}
          </p>

          <button
            type="button"
            @click="fetchTours"
            class="mt-6 rounded-full bg-[#193b2b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#10271e]"
          >
            Try Again
          </button>
        </div>

        <!-- Tour Cards -->
        <div
          v-else-if="filteredTours.length"
          class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="tour in filteredTours"
            :key="tour.id"
            class="group overflow-hidden rounded-3xl border border-[#e9e6dc] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >

            <!-- Image -->
            <div class="relative h-[270px] overflow-hidden">
              <img
                :src="getImageUrl(tour.image)"
                :alt="tour.name"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              <span class="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#193b2b] backdrop-blur">
                {{ tour.category || 'Adventure' }}
              </span>

              <span class="absolute bottom-5 left-5 text-sm font-medium text-white">
                {{ tour.duration }} journey
              </span>
            </div>

            <!-- Content -->
            <div class="p-7">
              <h3 class="font-serif text-2xl text-[#193b2b]">
                {{ tour.name }}
              </h3>

              <p class="mt-4 min-h-[84px] text-sm leading-7 text-slate-600">
                {{ tour.description }}
              </p>

              <!-- Details -->
              <div class="mt-5 flex flex-wrap gap-2">
                <span class="rounded-full bg-[#edf1eb] px-4 py-2 text-xs font-semibold text-[#365b43]">
                  {{ tour.duration }}
                </span>

                <span class="rounded-full bg-[#f3f0e8] px-4 py-2 text-xs font-semibold text-[#8b7044]">
                  {{ tour.difficulty }}
                </span>
              </div>
              <!-- Price and Actions -->
<div class="mt-7 border-t border-[#eeeae1] pt-6">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs text-slate-400">
        Starting price
      </p>

      <p class="mt-1 font-semibold text-[#193b2b]">
        {{ formatPrice(tour.price) }}
      </p>
    </div>
  </div>

  <div class="mt-5 grid grid-cols-2 gap-3">
    <!-- Explore Tour -->
    <RouterLink
      :to="`/tours/${tour.slug}`"
      class="flex items-center justify-center rounded-full border border-[#193b2b] px-3 py-3 text-sm font-semibold text-[#193b2b] transition hover:bg-[#193b2b] hover:text-white"
    >
      Explore Tour
    </RouterLink>

    <!-- Book Now -->
    <RouterLink
      :to="{
        path: '/booking',
        query: { tour: tour.slug }
      }"
    >
      <AppButton variant="primary" class="w-full">
        Book Now →
      </AppButton>
    </RouterLink>
  </div>
</div>
            </div>
          </article>
        </div>

        <!-- No Results -->
        <div
          v-else
          class="mt-12 rounded-3xl border border-[#e9e6dc] bg-white px-6 py-16 text-center"
        >
          <div class="text-4xl">🔎</div>

          <h3 class="mt-5 font-serif text-2xl text-[#193b2b]">
            {{ searchQuery ? 'No Tours Found' : 'No Tours Available Yet' }}
          </h3>

          <p class="mt-3 text-sm text-slate-500">
            {{
              searchQuery
                ? `We couldn't find any tours matching "${searchQuery}".`
                : 'Our next adventures will be available here soon.'
            }}
          </p>

          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="mt-6 font-semibold text-[#55745c] transition hover:text-[#9b8051]"
          >
            Clear Search
          </button>
        </div>

      </div>
    </section>

    <!-- Why Travel With Us -->
    <section class="bg-[#eeeee7] px-5 py-20 md:px-8">
      <div class="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

        <div>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
            Travel With Confidence
          </p>

          <h2 class="mt-5 font-serif text-4xl leading-tight text-[#193b2b] md:text-5xl">
            Your Adventure, Your Way
          </h2>

          <p class="mt-6 leading-8 text-slate-600">
            Every traveller has a different idea of the perfect adventure.
            Whether you dream of reaching the Himalayas, discovering
            traditional villages, or exploring remote landscapes,
            there's a journey waiting for you.
          </p>

          <RouterLink to="/contact" class="inline-block">
            <AppButton variant="primary" class="mt-8">
              Talk To Our Team →
            </AppButton>
          </RouterLink>
        </div>

        <div class="overflow-hidden rounded-[2rem]">
          <img
            src="/images/IMG_6464.jpg"
            alt="Nepal landscape and nature"
            class="h-[400px] w-full object-cover md:h-[470px]"
          />
        </div>

      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative overflow-hidden bg-[#193b2b] px-6 py-24 text-center">
      <div class="relative z-10 mx-auto max-w-3xl">

        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[#dfc99d]">
          Start Exploring
        </p>

        <h2 class="mt-5 font-serif text-4xl leading-tight text-white md:text-6xl">
          Nepal Is Waiting For You
        </h2>

        <p class="mx-auto mt-6 max-w-2xl leading-8 text-white/75">
          Have a destination in mind but need help planning?
          Let RoamNePura help you take the first step.
        </p>

        <div class="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <RouterLink to="/booking">
            <AppButton variant="light">
              Plan Your Trip →
            </AppButton>
          </RouterLink>

          <RouterLink to="/contact">
            <AppButton variant="outline">
              Contact Us
            </AppButton>
          </RouterLink>
        </div>

      </div>
    </section>

  </main>
</template>
