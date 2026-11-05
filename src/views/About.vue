
<script setup>
import AppButton from '../components/ui/AppButton.vue'

const reasons = [
  {
    number: '01',
    icon: '🏔️',
    title: 'Local Experience',
    description:
      'Discover Nepal beyond the usual tourist routes. Experience its beautiful landscapes, traditions, culture, and welcoming communities.'
  },
  {
    number: '02',
    icon: '🌿',
    title: 'Meaningful Journeys',
    description:
      'Every journey is an opportunity to explore somewhere new, meet different people, and create memories that last a lifetime.'
  },
  {
    number: '03',
    icon: '🤝',
    title: 'Travel With Confidence',
    description:
      'From discovering destinations to planning your adventure, we make it easier to find and organize your next Nepal experience.'
  }
]

const experiences = [
  {
    title: 'Mountain Adventures',
    description: 'Experience the beauty of the Himalayas and peaceful mountain trails.',
    image: '/images/IMG_6933.jpg'
  },
  {
    title: 'Culture & Traditions',
    description: 'Discover local communities, traditions, and the stories of Nepal.',
    image: '/images/IMG_6464.jpg'
  },
  {
    title: 'Nature & Exploration',
    description: 'Find beautiful landscapes, peaceful surroundings, and new adventures.',
    image: '/images/IMG_6933.jpg'
  }
]
</script>

<template>
  <main class="bg-[#f8f7f2]">

    <!-- Hero Section -->
    <section class="relative flex min-h-[65vh] items-center justify-center overflow-hidden">
      <img
        src="/images/IMG_6933.jpg"
        alt="Beautiful Himalayan landscape in Nepal"
        class="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div class="absolute inset-0 bg-[#10271e]/55"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.35em] text-[#dfc99d] md:text-sm">
          The Story Behind RoamNePura
        </p>

        <h1 class="mt-6 font-serif text-5xl font-medium leading-tight text-white md:text-7xl">
          Discover Nepal.
          <span class="block italic text-[#dfc99d]">
            Experience More.
          </span>
        </h1>

        <p class="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
          We believe that travelling is about more than reaching a destination.
          It's about discovering new places, experiencing different cultures,
          and creating unforgettable memories.
        </p>

        <RouterLink to="/destinations" class="inline-block">
          <AppButton variant="light" class="mt-9">
            Explore Nepal →
          </AppButton>
        </RouterLink>
      </div>

      <div class="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#f8f7f2] to-transparent"></div>
    </section>

    <!-- Who We Are -->
    <section class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        <!-- Images -->
        <div class="relative">
          <div class="overflow-hidden rounded-[2rem]">
            <img
              src="/images/IMG_6464.jpg"
              alt="Beautiful scenery in Nepal"
              class="h-[400px] w-full object-cover transition duration-700 hover:scale-105 md:h-[540px]"
            />
          </div>

          <div class="absolute -bottom-7 -right-3 max-w-[220px] rounded-2xl bg-[#193b2b] p-6 text-white shadow-xl md:-right-7">
            <p class="font-serif text-3xl italic text-[#dfc99d]">
              Nepal
            </p>
            <p class="mt-2 text-sm leading-6 text-white/80">
              A country of mountains, culture, nature, and unforgettable experiences.
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="pt-5 lg:pt-0">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
            Who We Are
          </p>

          <h2 class="mt-5 font-serif text-4xl leading-tight text-[#193b2b] md:text-5xl">
            Bringing You Closer To The Beauty Of Nepal
          </h2>

          <p class="mt-7 leading-8 text-slate-600">
            RoamNePura is a travel platform created for people who want
            to explore Nepal in a meaningful way. From the breathtaking
            Himalayas to peaceful valleys and culturally rich cities,
            Nepal has something special waiting around every corner.
          </p>

          <p class="mt-5 leading-8 text-slate-600">
            Our goal is simple: make it easier for travellers to discover
            destinations, learn about different experiences, and plan
            adventures that match their interests.
          </p>

          <p class="mt-5 leading-8 text-slate-600">
            Whether you are looking for a mountain adventure, a cultural
            experience, or a peaceful escape into nature, RoamNePura
            is here to help you get started.
          </p>

          <RouterLink to="/destinations" class="inline-block">
            <AppButton variant="primary" class="mt-8">
              Discover Destinations →
            </AppButton>
          </RouterLink>
        </div>

      </div>
    </section>

    <!-- Mission Section -->
    <section class="bg-[#193b2b] px-6 py-20 md:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[#dfc99d]">
          Our Mission
        </p>

        <h2 class="mt-6 font-serif text-4xl leading-tight text-white md:text-6xl">
          Making Every Journey
          <span class="italic text-[#dfc99d]">Meaningful.</span>
        </h2>

        <p class="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
          We want to make exploring Nepal easier and more inspiring.
          Our mission is to connect travellers with destinations and
          experiences while celebrating the natural beauty and rich
          cultural heritage of our country.
        </p>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-6xl">

        <div class="mx-auto max-w-2xl text-center">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
            Why RoamNePura
          </p>

          <h2 class="mt-5 font-serif text-4xl text-[#193b2b] md:text-5xl">
            More Than Just A Trip
          </h2>

          <p class="mt-5 leading-8 text-slate-600">
            We believe travelling is about the experiences you collect,
            the people you meet, and the memories you create.
          </p>
        </div>

        <div class="mt-14 grid gap-6 md:grid-cols-3">
          <article
            v-for="reason in reasons"
            :key="reason.number"
            class="group rounded-3xl border border-[#e9e6dc] bg-white p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div class="flex items-center justify-between">
              <span class="text-4xl">{{ reason.icon }}</span>
              <span class="font-serif text-sm text-[#b39a6d]">
                {{ reason.number }}
              </span>
            </div>

            <h3 class="mt-8 font-serif text-2xl text-[#193b2b]">
              {{ reason.title }}
            </h3>

            <p class="mt-4 text-sm leading-7 text-slate-600">
              {{ reason.description }}
            </p>

            <div class="mt-7 h-px w-12 bg-[#b39a6d] transition-all duration-300 group-hover:w-full"></div>
          </article>
        </div>

      </div>
    </section>

    <!-- Experiences -->
    <section class="bg-[#eeeee7] px-5 py-20 md:px-8 md:py-24">
      <div class="mx-auto max-w-6xl">

        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
              Explore The Possibilities
            </p>

            <h2 class="mt-4 font-serif text-4xl text-[#193b2b] md:text-5xl">
              Find Your Kind Of Adventure
            </h2>
          </div>

          <RouterLink
            to="/destinations"
            class="font-semibold text-[#365b43] transition hover:text-[#9b8051]"
          >
            View all destinations →
          </RouterLink>
        </div>

        <div class="mt-12 grid gap-7 md:grid-cols-3">
          <article
            v-for="experience in experiences"
            :key="experience.title"
            class="group overflow-hidden rounded-3xl bg-white shadow-sm"
          >
            <div class="overflow-hidden">
              <img
                :src="experience.image"
                :alt="experience.title"
                class="h-[270px] w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            <div class="p-7">
              <h3 class="font-serif text-2xl text-[#193b2b]">
                {{ experience.title }}
              </h3>

              <p class="mt-3 text-sm leading-7 text-slate-600">
                {{ experience.description }}
              </p>

              <RouterLink
                to="/destinations"
                class="mt-6 inline-block text-sm font-semibold text-[#55745c] transition hover:text-[#9b8051]"
              >
                Explore destinations →
              </RouterLink>
            </div>
          </article>
        </div>

      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative overflow-hidden bg-[#193b2b] px-6 py-24 text-center">
      <div class="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10"></div>
      <div class="absolute -bottom-36 -right-20 h-96 w-96 rounded-full border border-white/10"></div>

      <div class="relative z-10 mx-auto max-w-3xl">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[#dfc99d]">
          Your Adventure Awaits
        </p>

        <h2 class="mt-5 font-serif text-4xl leading-tight text-white md:text-6xl">
          Let's Explore Nepal Together
        </h2>

        <p class="mx-auto mt-6 max-w-2xl leading-8 text-white/75">
          Your next unforgettable adventure could be closer than you think.
          Discover destinations and start planning your journey with RoamNePura.
        </p>

        <div class="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <RouterLink to="/booking">
            <AppButton variant="light">
              Start Your Journey →
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
