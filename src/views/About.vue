<script setup>
import AppButton from '../components/ui/AppButton.vue'

const reasons = [
  {
    title: 'Local Experience',
    description:
      'We know Nepal beyond the usual tourist routes and help you experience its real beauty, culture, and people.'
  },
  {
    title: 'Memorable Journeys',
    description:
      'Every trip is planned to give you meaningful experiences, breathtaking views, and memories worth keeping.'
  },
  {
    title: 'Travel With Confidence',
    description:
      'From planning your adventure to completing your journey, we are here to make your travel experience smooth and enjoyable.'
  }
]
</script>

<template>
  <!-- Hero Section -->
  <section class="relative min-h-[60vh]">

    <img
      src="/images/IMG_6933.jpg"
      alt="Nepal mountains"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/45"></div>

    <div
      class="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <p class="text-lg font-semibold text-white">
        About RoamNePura
      </p>

      <h1
        class="mt-2 text-4xl font-bold text-white md:text-6xl"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.45);"
      >
        Your Journey Starts Here
      </h1>

      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white">
        We are here to help you discover Nepal through unforgettable
        adventures, authentic experiences, and beautiful journeys.
      </p>
    </div>

  </section>


  <!-- Who We Are -->
  <section class="px-6 py-16">

    <div class="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">

      <!-- Image -->
      <div class="overflow-hidden rounded-2xl">
        <img
          src="/images/IMG_6464.jpg"
          alt="Beautiful Nepal landscape"
          class="h-[400px] w-full object-cover"
        />
      </div>


      <!-- Content -->
      <div>

        <p class="font-semibold text-green-700">
          Who We Are
        </p>

        <h2 class="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
          Discover Nepal With RoamNePura
        </h2>

        <p class="mt-5 leading-relaxed text-slate-600">
          RoamNePura is a travel platform created for people who want to
          explore Nepal in a meaningful way. From the Himalayas to peaceful
          valleys and culturally rich cities, Nepal has something special
          waiting around every corner.
        </p>

        <p class="mt-4 leading-relaxed text-slate-600">
          Our goal is simple: make it easier for travelers to discover
          Nepal, plan their adventures, and experience the country beyond
          the ordinary tourist destinations.
        </p>

        
<RouterLink
  to="/tours"
  custom
  v-slot="{ navigate }"
>
  <AppButton
    variant="primary"
    class="mt-6"
    @click="navigate"
  >
    Explore Our Tours
  </AppButton>
</RouterLink>

      </div>

    </div>

  </section>


  <!-- Why Choose Us -->
  <section class="bg-slate-50 px-6 py-16">

    <div class="mx-auto max-w-6xl">

      <div class="text-center">

        <p class="font-semibold text-green-700">
          Why RoamNePura
        </p>

        <h2 class="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
          More Than Just A Trip
        </h2>

        <p class="mx-auto mt-3 max-w-2xl text-slate-600">
          We believe traveling is about the experiences you collect,
          the people you meet, and the memories you create.
        </p>

      </div>


      <!-- Reason Cards -->
      <div class="mt-10 grid gap-6 md:grid-cols-3">

        <div
          v-for="reason in reasons"
          :key="reason.title"
          class="rounded-xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >

          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700"
          >
            ✓
          </div>

          <h3 class="mt-4 text-xl font-bold text-slate-800">
            {{ reason.title }}
          </h3>

          <p class="mt-3 leading-relaxed text-slate-600">
            {{ reason.description }}
          </p>

        </div>

      </div>

    </div>

  </section>


  <!-- Stats -->
  <section class="px-6 py-16">

    <div class="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">

      <div>
        <h3 class="text-4xl font-bold text-green-700">
          10+
        </h3>
        <p class="mt-2 text-slate-600">
          Destinations
        </p>
      </div>

      <div>
        <h3 class="text-4xl font-bold text-green-700">
          20+
        </h3>
        <p class="mt-2 text-slate-600">
          Adventures
        </p>
      </div>

      <div>
        <h3 class="text-4xl font-bold text-green-700">
          100%
        </h3>
        <p class="mt-2 text-slate-600">
          Passion for Nepal
        </p>
      </div>

    </div>

  </section>


  <!-- CTA -->
  <section class="bg-green-700 px-6 py-16 text-center">

    <div class="mx-auto max-w-3xl">

      <h2 class="text-3xl font-bold text-white md:text-4xl">
        Let's Explore Nepal Together
      </h2>

      <p class="mt-4 text-lg text-green-50">
        Your next unforgettable adventure could be closer than you think.
        Start planning your journey with RoamNePura today.
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
    Start Your Journey
  </AppButton>
</RouterLink>

    </div>

  </section>
</template>