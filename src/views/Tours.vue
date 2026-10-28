<script setup>
import { ref, computed } from 'vue'
import AppButton from '../components/ui/AppButton.vue'

const searchQuery = ref('')

const tours = [
  {
    name: 'Everest Base Camp',
    image: '/images/IMG_6933.jpg',
    duration: '14 Days',
    difficulty: 'Challenging',
    price: 'From $1,200',
    description:
      'Trek through the legendary Khumbu region and stand at the base of the world’s highest mountain.'
  },
  {
    name: 'Annapurna Circuit',
    image: '/images/IMG_6464.jpg',
    duration: '12 Days',
    difficulty: 'Moderate',
    price: 'From $950',
    description:
      'Experience diverse landscapes, traditional villages, mountain passes, and spectacular Himalayan views.'
  },
  {
    name: 'Upper Mustang',
    image: '/images/IMG_6933.jpg',
    duration: '10 Days',
    difficulty: 'Moderate',
    price: 'From $1,050',
    description:
      'Discover the hidden kingdom of Mustang, ancient caves, Tibetan culture, and dramatic desert landscapes.'
  }
]

const tourSlug = (name) => {
  const slugs = {
    'Everest Base Camp': 'everest-base-camp',
    'Annapurna Circuit': 'annapurna-circuit',
    'Upper Mustang': 'upper-mustang'
  }

  return slugs[name]
}

const filteredTours = computed(() => {
  return tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <!-- Hero Section -->
  <section class="relative min-h-[60vh]">

    <img
      src="/images/IMG_6933.jpg"
      alt="Beautiful Nepal mountains"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <div
      class="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <p class="text-lg font-semibold text-white">
        Explore With RoamNePura
      </p>

      <h1
        class="mt-2 text-4xl font-bold text-white md:text-6xl"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.45);"
      >
        Find Your Perfect Adventure
      </h1>

      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white">
        Explore carefully designed tours across Nepal and create unforgettable
        memories in the heart of the Himalayas.
      </p>
    </div>

  </section>


  <!-- Tours Section -->
  <section class="px-6 py-16">

    <div class="mx-auto max-w-6xl">

      <h2 class="text-3xl font-bold text-slate-800 md:text-4xl">
        Explore Our Tours
      </h2>

      <p class="mt-3 max-w-2xl text-slate-600">
        Choose from our collection of unforgettable adventures across Nepal.
      </p>

      <!-- Search -->
      <div class="mt-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tours..."
          class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </div>

    </div>


    <!-- Tour Cards -->
    <div class="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">

      <div
        v-for="tour in filteredTours"
        :key="tour.name"
        class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
      >

        <!-- Image -->
        <div class="h-56 overflow-hidden">

          <img
            :src="tour.image"
            :alt="tour.name"
            class="h-full w-full object-cover transition duration-300 hover:scale-105"
          />

        </div>


        <!-- Content -->
        <div class="p-5">

          <h3 class="text-xl font-bold text-slate-800">
            {{ tour.name }}
          </h3>

          <p class="mt-2 text-slate-600">
            {{ tour.description }}
          </p>


          <!-- Tour Info -->
          <div class="mt-4 flex flex-wrap gap-2">

            <span
              class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
            >
              {{ tour.duration }}
            </span>

            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {{ tour.difficulty }}
            </span>

          </div>


          <!-- Price + Button -->
          <div class="mt-5 flex items-center justify-between">

            <span class="font-bold text-slate-800">
              {{ tour.price }}
            </span>

            

<RouterLink
  :to="{ path: '/booking', query: { tour: tourSlug(tour.name) } }"
  custom
  v-slot="{ navigate }"
>
  <AppButton
    variant="primary"
    @click="navigate"
  >
    Book Now
  </AppButton>
</RouterLink>


          </div>

        </div>

      </div>


      <!-- No Results -->
      <p
        v-if="filteredTours.length === 0"
        class="col-span-full py-10 text-center text-slate-500"
      >
        No tours found.
      </p>

    </div>

  </section>


  <!-- Call To Action -->
  <section class="bg-green-700 px-6 py-16 text-center">

    <div class="mx-auto max-w-3xl">

      <h2 class="text-3xl font-bold text-white md:text-4xl">
        Ready For Your Next Adventure?
      </h2>

      <p class="mt-4 text-lg text-green-50">
        Let RoamNePura help you experience the beauty, culture, and adventure
        of Nepal.
      </p>

      
<RouterLink
    to="/booking"
    custom
    v-slot="{ navigate }"
>
    <AppButton
        variant="light"
        class="mt-7"
        @click="navigate"
    >
        Plan Your Trip
    </AppButton>
</RouterLink>
    </div>

  </section>
</template>
