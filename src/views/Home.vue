<script setup>
import { ref, onMounted } from 'vue'
import { getReviews, submitReview } from '../api/reviews'
import { RouterLink } from 'vue-router'
import { getDestinations } from '../api/destinations'

const destinations = ref([])
const loading = ref(true)
const error = ref('')
const reviews = ref([])
const reviewsLoading = ref(true)
const reviewError = ref('')
const showReviewForm = ref(false)
const submittingReview = ref(false)
const reviewSuccess = ref('')

const reviewForm = ref({
  name: '',
  email: '',
  tour: '',
  rating: 5,
  comment: '',
  website: ''
})

const API_ORIGIN = 'http://127.0.0.1:8000'

const fallbackImages = [
  '/images/IMG_6464.jpg',
  '/images/IMG_6933.jpg',
  '/images/IMG_6464.jpg'
]

function destinationImage(destination, index) {
  if (!destination.image) {
    return fallbackImages[index % fallbackImages.length]
  }

  if (destination.image.startsWith('http')) {
    return destination.image
  }

  return `${API_ORIGIN}/storage/${destination.image.replace(/^\/+/, '')}`
}

async function fetchDestinations() {
  loading.value = true
  error.value = ''

  try {
    const response = await getDestinations()

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || []

    destinations.value = data
      .filter(destination => Number(destination.is_published) === 1)
      .slice(0, 3)
  } catch (err) {
    console.error('Failed to load destinations:', err)
    error.value = 'Unable to load destinations right now.'
  } finally {
    loading.value = false
  }
}
async function fetchReviews() {
  reviewsLoading.value = true
  reviewError.value = ''

  try {
    const response = await getReviews()
    reviews.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    console.error('Failed to load reviews:', err)
    reviewError.value = 'Unable to load customer reviews right now.'
  } finally {
    reviewsLoading.value = false
  }
}

async function handleReviewSubmit() {
  submittingReview.value = true
  reviewError.value = ''
  reviewSuccess.value = ''

  try {
    const response = await submitReview(reviewForm.value)

    reviewSuccess.value =
      response.data.message || 'Your review was submitted successfully.'

    reviewForm.value = {
      name: '',
      email: '',
      tour: '',
      rating: 5,
      comment: '',
      website: ''
    }

    showReviewForm.value = false
  } catch (err) {
    console.error('Review submission failed:', err)

    reviewError.value =
      err.response?.data?.message ||
      'Unable to submit your review. Please try again.'
  } finally {
    submittingReview.value = false
  }
}

onMounted(() => {
  fetchDestinations()
  fetchReviews()
})
</script>

<template>
  <main class="bg-[#f7f5ef] text-[#193d32]">

    <!-- HERO -->
    <section class="relative flex min-h-[760px] min-h-[95svh] items-center overflow-hidden">

      <img
        src="/images/IMG_6933.jpg"
        alt="Beautiful Nepal landscape"
        class="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"></div>

      <div class="relative z-10 mx-auto w-full max-w-7xl px-6 pb-36 pt-36 md:px-12">

        <div class="max-w-3xl fade-in">

          <p class="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
            Travel · Explore · Experience · Belong
          </p>

          <h1 class="font-serif text-5xl font-medium leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Discover Nepal
            <span class="mt-1 block italic text-[#e8c99a]">
              Beyond Ordinary.
            </span>
          </h1>

          <p class="mt-7 max-w-xl text-base leading-7 text-white/90 md:text-lg">
            Curated journeys through breathtaking landscapes, timeless
            traditions and extraordinary experiences. Discover the Nepal
            you've always wanted to explore.
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-4">

            <RouterLink
              to="/destinations"
              class="inline-flex items-center gap-5 rounded-full bg-[#193d32] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#245744]"
            >
              Explore Destinations
              <span class="text-lg">→</span>
            </RouterLink>

            <RouterLink
              to="/tours"
              class="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#193d32]"
            >
              Discover Tours
              <span>↗</span>
            </RouterLink>

          </div>
        </div>

      </div>

      <!-- FLOATING JOURNEY PANEL -->
      <div class="absolute bottom-7 left-1/2 z-20 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">

        <div class="grid grid-cols-1 gap-4 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:grid-cols-3 sm:items-center sm:rounded-full sm:px-8">

          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf0e8] text-xl">
              ◈
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#193d32]/60">
                Destinations
              </p>
              <p class="text-sm font-medium text-[#193d32]">
                Find your next place
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4 border-t border-[#193d32]/10 pt-4 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf0e8] text-xl">
              ◷
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#193d32]/60">
                Experiences
              </p>
              <p class="text-sm font-medium text-[#193d32]">
                Find your adventure
              </p>
            </div>
          </div>

          <RouterLink
            to="/booking"
            class="flex items-center justify-between rounded-full bg-[#193d32] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#245744]"
          >
            Start Your Journey
            <span class="text-lg">→</span>
          </RouterLink>

        </div>
      </div>

    </section>

    <!-- DESTINATIONS -->
    <section class="px-6 py-24 md:px-12">

      <div class="mx-auto max-w-7xl">

        <div class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p class="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#a47b45]">
              Explore the extraordinary
            </p>

            <h2 class="font-serif text-4xl font-medium text-[#193d32] md:text-6xl">
              Places worth <span class="italic">discovering.</span>
            </h2>

            <p class="mt-5 max-w-xl leading-7 text-[#65736a]">
              From peaceful valleys to the world's highest mountains,
              find the places that make Nepal unforgettable.
            </p>
          </div>

          <RouterLink
            to="/destinations"
            class="inline-flex items-center gap-3 text-sm font-semibold text-[#193d32] transition hover:text-[#a47b45]"
          >
            View all destinations
            <span class="text-lg">→</span>
          </RouterLink>

        </div>

        <div v-if="loading" class="grid gap-7 md:grid-cols-3">
          <div
            v-for="item in 3"
            :key="item"
            class="h-[390px] animate-pulse rounded-3xl bg-[#e8e6dc]"
          ></div>
        </div>

        <div
          v-else-if="error"
          class="rounded-2xl bg-white p-8 text-center text-[#65736a]"
        >
          {{ error }}
          <button
            @click="fetchDestinations"
            class="ml-2 font-semibold text-[#193d32] underline"
          >
            Try again
          </button>
        </div>

        <div
          v-else-if="destinations.length"
          class="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
        >

          <RouterLink
            v-for="(destination, index) in destinations"
            :key="destination.id"
            :to="`/destinations/${destination.slug}`"
            class="group relative h-[420px] overflow-hidden rounded-3xl bg-[#dce2d8] shadow-sm"
          >

            <img
              :src="destinationImage(destination, index)"
              :alt="destination.name"
              class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

            <div class="absolute left-6 top-6">
              <span class="rounded-full border border-white/50 bg-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                Nepal
              </span>
            </div>

            <div class="absolute inset-x-0 bottom-0 p-7 text-white">

              <p class="mb-2 text-xs uppercase tracking-[0.2em] text-white/75">
                {{ destination.location || 'Explore Nepal' }}
              </p>

              <h3 class="font-serif text-3xl font-medium md:text-4xl">
                {{ destination.name }}
              </h3>

              <p class="mt-3 line-clamp-2 max-w-sm text-sm leading-6 text-white/80">
                {{ destination.description }}
              </p>

              <div class="mt-6 flex items-center justify-between border-t border-white/30 pt-5">

                <span class="text-xs text-white/80">
                  {{ destination.duration || 'Discover the journey' }}
                </span>

                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-[#193d32] transition group-hover:rotate-[-45deg]">
                  →
                </span>

              </div>
            </div>

          </RouterLink>

        </div>

        <div
          v-else
          class="rounded-2xl bg-white p-10 text-center text-[#65736a]"
        >
          New destinations are coming soon.
        </div>

      </div>
    </section>

    <!-- EXPERIENCE SECTION -->
    <section class="bg-[#eaece3] px-6 py-24 md:px-12">

      <div class="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

        <div class="relative">

          <img
            src="/images/IMG_6464.jpg"
            alt="Explore Nepal's natural beauty"
            class="h-[460px] w-full rounded-3xl object-cover shadow-xl"
          />

          <div class="absolute -bottom-7 -right-4 max-w-[220px] rounded-2xl bg-[#193d32] p-6 text-white shadow-xl md:-right-7">
            <p class="font-serif text-4xl italic">Nepal</p>
            <p class="mt-2 text-sm leading-6 text-white/75">
              A world of extraordinary landscapes and unforgettable stories.
            </p>
          </div>

        </div>

        <div class="lg:pl-8">

          <p class="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#a47b45]">
            More than a destination
          </p>

          <h2 class="font-serif text-4xl font-medium leading-tight text-[#193d32] md:text-6xl">
            Every journey has a story.
            <span class="italic">Make yours unforgettable.</span>
          </h2>

          <p class="mt-7 leading-8 text-[#65736a]">
            Experience Nepal through its beautiful landscapes, welcoming
            communities, rich traditions and remarkable adventures.
            Whether you seek peaceful escapes or thrilling journeys,
            there's something waiting for you.
          </p>

          <div class="mt-9 grid grid-cols-2 gap-6">

            <div>
              <p class="font-serif text-4xl text-[#193d32]">01</p>
              <p class="mt-2 text-sm font-semibold">Authentic experiences</p>
              <p class="mt-1 text-xs leading-5 text-[#65736a]">
                Discover local places and culture.
              </p>
            </div>

            <div>
              <p class="font-serif text-4xl text-[#193d32]">02</p>
              <p class="mt-2 text-sm font-semibold">Memorable journeys</p>
              <p class="mt-1 text-xs leading-5 text-[#65736a]">
                Create stories worth remembering.
              </p>
            </div>

          </div>

          <RouterLink
            to="/about"
            class="mt-9 inline-flex items-center gap-4 rounded-full bg-[#193d32] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#245744]"
          >
            Our Story
            <span>→</span>
          </RouterLink>

        </div>

      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="px-6 py-24 md:px-12">

      <div class="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#193d32] px-7 py-20 text-center md:px-16">

        <div class="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10"></div>
        <div class="absolute -bottom-36 -left-16 h-96 w-96 rounded-full border border-white/10"></div>

        <div class="relative z-10 mx-auto max-w-3xl">

          <p class="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[#d8bd91]">
            Your next chapter begins here
          </p>

          <h2 class="font-serif text-4xl font-medium leading-tight text-white md:text-6xl">
            The mountains are calling.
            <span class="block italic text-[#e8c99a]">
              Are you ready?
            </span>
          </h2>

          <p class="mx-auto mt-6 max-w-xl leading-7 text-white/70">
            Find your destination, discover new experiences and start
            planning your next unforgettable journey through Nepal.
          </p>

          <RouterLink
            to="/destinations"
            class="mt-9 inline-flex items-center gap-5 rounded-full bg-[#f7f5ef] px-8 py-4 text-sm font-semibold text-[#193d32] transition hover:bg-[#e8c99a]"
          >
            Explore Nepal
            <span class="text-lg">→</span>
          </RouterLink>

        </div>
      </div>
    </section>


<!-- CUSTOMER REVIEWS -->
<section class="bg-[#eaece3] px-6 py-24 md:px-12">
  <div class="mx-auto max-w-7xl">

    <div class="mb-12 text-center">
      <p class="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#a47b45]">
        Stories from our travelers
      </p>

      <h2 class="font-serif text-4xl font-medium text-[#193d32] md:text-6xl">
        Memories worth <span class="italic">sharing.</span>
      </h2>

      <p class="mx-auto mt-5 max-w-xl leading-7 text-[#65736a]">
        Read about the experiences of travelers who explored Nepal with us.
      </p>
    </div>

    <div v-if="reviewsLoading" class="py-12 text-center text-[#65736a]">
      Loading customer reviews...
    </div>

    <div v-else-if="reviewError && !reviews.length"
      class="py-12 text-center text-red-700">
      {{ reviewError }}
    </div>

    <div v-else-if="reviews.length"
      class="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

      <article
        v-for="review in reviews"
        :key="review.id"
        class="rounded-3xl bg-white p-8 shadow-sm">

        <div class="mb-5 flex gap-1 text-xl text-[#c18d42]">
          <span v-for="star in 5" :key="star">
            {{ star <= Number(review.rating) ? '★' : '☆' }}
          </span>
        </div>

        <p class="leading-7 text-[#65736a]">
          "{{ review.comment }}"
        </p>

        <div class="mt-7 border-t border-[#193d32]/10 pt-5">
          <h3 class="font-semibold text-[#193d32]">
            {{ review.name }}
          </h3>
          <p class="mt-1 text-xs text-[#a47b45]">
            {{ review.tour }}
          </p>
        </div>
      </article>

    </div>

    <div v-else class="rounded-3xl bg-white px-6 py-12 text-center">
      <p class="font-serif text-2xl text-[#193d32]">
        Be the first to share your experience.
      </p>
      <p class="mt-3 text-sm text-[#65736a]">
        Your travel story could inspire someone else's journey.
      </p>
    </div>

    <div v-if="reviewSuccess"
      class="mt-8 rounded-xl bg-white p-4 text-center text-sm text-[#193d32]">
      {{ reviewSuccess }}
    </div>

    <div class="mt-10 text-center">
      <button
        @click="showReviewForm = !showReviewForm"
        class="rounded-full bg-[#193d32] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#245744]">
        {{ showReviewForm ? 'Close Form' : 'Add Your Review' }}
      </button>
    </div>

    <form
      v-if="showReviewForm"
      @submit.prevent="handleReviewSubmit"
      class="mx-auto mt-10 max-w-2xl space-y-5 rounded-3xl bg-white p-7 shadow-sm md:p-10">

      <!-- Honeypot field to catch basic spam bots -->
<div
  class="absolute -left-[9999px]"
  aria-hidden="true"
>
  <label for="review-website">Leave this field empty</label>
  <input
    id="review-website"
    v-model="reviewForm.website"
    type="text"
    name="website"
    tabindex="-1"
    autocomplete="off"
  />
</div>
      <h3 class="font-serif text-3xl text-[#193d32]">
        Share Your Experience
      </h3>

      <div>
        <label class="mb-2 block text-sm font-medium">Your Name</label>
        <input v-model="reviewForm.name" required maxlength="255"
          class="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#193d32]"
          placeholder="Enter your name" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Email Address</label>
        <input v-model="reviewForm.email" type="email" required maxlength="255"
          class="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#193d32]"
          placeholder="Enter your email" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Tour Name</label>
        <input v-model="reviewForm.tour" required maxlength="255"
          class="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#193d32]"
          placeholder="Which tour did you experience?" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Your Rating</label>
        <select v-model.number="reviewForm.rating" required
          class="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#193d32]">
          <option :value="5">★★★★★ - Excellent</option>
          <option :value="4">★★★★ - Very Good</option>
          <option :value="3">★★★ - Good</option>
          <option :value="2">★★ - Fair</option>
          <option :value="1">★ - Poor</option>
        </select>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Your Review</label>
        <textarea v-model="reviewForm.comment" required maxlength="5000" rows="5"
          class="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#193d32]"
          placeholder="Tell us about your experience..."></textarea>
      </div>

      <p v-if="reviewError" class="text-sm text-red-600">
        {{ reviewError }}
      </p>

      <button type="submit" :disabled="submittingReview"
        class="w-full rounded-full bg-[#193d32] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#245744] disabled:cursor-not-allowed disabled:opacity-60">
        {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
      </button>

      <p class="text-center text-xs text-[#65736a]">
        Your review will appear publicly after admin approval.
      </p>

    </form>

  </div>
</section>


  </main>
</template>
