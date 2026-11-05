<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSiteSettings } from '../api/siteSettings'

const menuOpen = ref(false)
const route = useRoute()

const siteName = ref('RoamNePura')

const isHome = computed(() => route.path === '/')

function closeMenu() {
  menuOpen.value = false
}

async function loadSiteSettings() {
  try {
    const response = await getSiteSettings()
    const data = response.data.settings || response.data

    siteName.value = data.site_name || 'RoamNePura'
  } catch (error) {
    console.error('Unable to load navbar settings:', error)
  }
}

onMounted(loadSiteSettings)
</script>

<template>
  <nav
    class="z-50 w-full px-4 pt-4 md:px-8"
    :class="isHome ? 'absolute left-0 top-0' : 'sticky top-0 bg-[#f7f5ef] pb-3'"
  >
    <div class="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/85 px-5 py-3 shadow-lg backdrop-blur-xl md:px-7">

      <!-- LOGO -->
      <RouterLink
        to="/"
        class="flex shrink-0 items-center gap-3"
        @click="closeMenu"
      >
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#193d32] font-serif text-xl font-bold text-white">
          {{ siteName.charAt(0).toUpperCase() }}
        </span>

        <span class="font-serif text-xl font-bold tracking-tight text-[#193d32]">
          {{ siteName }}
        </span>
      </RouterLink>

      <!-- DESKTOP NAVIGATION -->
      <div class="hidden items-center gap-1 rounded-full bg-[#f0f0eb] p-1 md:flex">
        <RouterLink
          to="/"
          class="rounded-full px-5 py-2 text-xs font-medium transition"
          :class="route.path === '/' ? 'bg-[#193d32] text-white shadow-sm' : 'text-[#52645a] hover:text-[#193d32]'"
        >
          Home
        </RouterLink>

        <RouterLink to="/destinations" class="rounded-full px-5 py-2 text-xs font-medium transition" active-class="bg-[#193d32] text-white shadow-sm">
          Destinations
        </RouterLink>

        <RouterLink to="/tours" class="rounded-full px-5 py-2 text-xs font-medium transition" active-class="bg-[#193d32] text-white shadow-sm">
          Tours
        </RouterLink>

        <RouterLink to="/about" class="rounded-full px-5 py-2 text-xs font-medium transition" active-class="bg-[#193d32] text-white shadow-sm">
          About
        </RouterLink>

        <RouterLink to="/contact" class="rounded-full px-5 py-2 text-xs font-medium transition" active-class="bg-[#193d32] text-white shadow-sm">
          Contact
        </RouterLink>
      </div>

      <!-- BOOKING BUTTON -->
      <RouterLink
        to="/booking"
        class="hidden items-center gap-4 rounded-full bg-[#193d32] py-2 pl-5 pr-2 text-xs font-semibold text-white transition hover:bg-[#245744] md:flex"
      >
        Book a Journey
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-[#193d32]">
          →
        </span>
      </RouterLink>

      <!-- MOBILE MENU BUTTON -->
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-[#193d32] text-xl text-white md:hidden"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation menu"
      >
        {{ menuOpen ? '×' : '☰' }}
      </button>

      <!-- MOBILE MENU -->
      <div
        v-if="menuOpen"
        class="absolute left-0 right-0 top-[calc(100%+10px)] rounded-3xl border border-white/60 bg-white p-5 shadow-2xl md:hidden"
      >
        <div class="flex flex-col gap-2">
          <RouterLink to="/" class="rounded-xl px-4 py-3 text-sm font-medium text-[#193d32] hover:bg-[#edf1e9]" @click="closeMenu">
            Home
          </RouterLink>

          <RouterLink to="/destinations" class="rounded-xl px-4 py-3 text-sm font-medium text-[#193d32] hover:bg-[#edf1e9]" @click="closeMenu">
            Destinations
          </RouterLink>

          <RouterLink to="/tours" class="rounded-xl px-4 py-3 text-sm font-medium text-[#193d32] hover:bg-[#edf1e9]" @click="closeMenu">
            Tours
          </RouterLink>

          <RouterLink to="/about" class="rounded-xl px-4 py-3 text-sm font-medium text-[#193d32] hover:bg-[#edf1e9]" @click="closeMenu">
            About
          </RouterLink>

          <RouterLink to="/contact" class="rounded-xl px-4 py-3 text-sm font-medium text-[#193d32] hover:bg-[#edf1e9]" @click="closeMenu">
            Contact
          </RouterLink>

          <RouterLink
            to="/booking"
            class="mt-2 flex items-center justify-between rounded-full bg-[#193d32] px-5 py-4 text-sm font-semibold text-white"
            @click="closeMenu"
          >
            Book a Journey
            <span class="text-lg">→</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
