<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createInquiry } from '../api/inquiries'
import { getDestinations } from '../api/destinations'
import { getSiteSettings } from '../api/siteSettings'

const route = useRoute()

const destinations = ref([])
const selectedDestinationId = ref('')
const loadingDestinations = ref(false)

const siteSettings = ref({
  site_name: 'RoamNePura',
  contact_email: '',
  contact_phone: '',
  address: ''
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)
const submitting = ref(false)
const error = ref('')

async function loadSiteSettings() {
  try {
    const response = await getSiteSettings()
    const data = response.data.settings || response.data

    siteSettings.value = {
      site_name: data.site_name || 'RoamNePura',
      contact_email: data.contact_email || '',
      contact_phone: data.contact_phone || '',
      address: data.address || ''
    }
  } catch (err) {
    console.error('Unable to load contact settings:', err)
  }
}

const loadDestinations = async () => {
  loadingDestinations.value = true

  try {
    const response = await getDestinations()
    destinations.value = response.data.filter(
      destination => destination.is_published
    )

    const requestedDestination = route.query.destination

    if (requestedDestination) {
      const normalized = String(requestedDestination)
        .toLowerCase()
        .replace(/\s+/g, '-')

      const match = destinations.value.find(destination =>
        destination.slug?.toLowerCase() === normalized ||
        destination.name?.toLowerCase() === String(requestedDestination).toLowerCase()
      )

      if (match) {
        selectedDestinationId.value = match.id
      }
    }
  } catch (err) {
    console.error('Unable to load destinations:', err)
  } finally {
    loadingDestinations.value = false
  }
}

const submitForm = async () => {
  submitted.value = false
  error.value = ''

  if (
    !form.value.name.trim() ||
    !form.value.email.trim() ||
    !form.value.message.trim()
  ) {
    error.value = 'Please complete all required fields.'
    return
  }

  submitting.value = true

  try {
    const fullMessage = form.value.subject.trim()
      ? `Subject: ${form.value.subject.trim()}\n\n${form.value.message.trim()}`
      : form.value.message.trim()

    await createInquiry({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      destination_id: selectedDestinationId.value || null,
      message: fullMessage
    })

    submitted.value = true

    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    selectedDestinationId.value = ''
  } catch (err) {
    console.error('Inquiry submission failed:', err)

    error.value =
      err.response?.data?.message ||
      'Unable to send your inquiry. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadSiteSettings()
  loadDestinations()
})
</script>

<template>
  <main class="bg-[#f8f7f2]">

    <!-- Hero -->
    <section class="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
      <img
        src="/images/IMG_6933.jpg"
        alt="Beautiful mountain landscape in Nepal"
        class="absolute inset-0 h-full w-full object-cover"
      />

      <div class="absolute inset-0 bg-[#10271e]/55"></div>

      <div class="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#d7c49a]">
          Get In Touch
        </p>

        <h1 class="mt-5 font-serif text-5xl font-medium text-white md:text-7xl">
          Let's Plan Your Journey
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
          Have a question or need help planning your Nepal adventure?
          Tell us what you're looking for. We'd love to help.
        </p>
      </div>
    </section>

    <!-- Contact content -->
    <section class="px-5 py-20 md:px-8 md:py-24">
      <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">

        <!-- Information -->
        <div class="py-3">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
            We'd Love To Hear From You
          </p>

          <h2 class="mt-4 font-serif text-4xl leading-tight text-[#193b2b] md:text-5xl">
            Let's Talk About Your Next Adventure
          </h2>

          <p class="mt-6 max-w-lg leading-8 text-slate-600">
            Whether you have questions about our destinations, need
            assistance planning your trip, or want to learn more about
            travelling in Nepal, our team is here to help.
          </p>

          <div class="mt-12 space-y-8">

            <!-- Location -->
            <div
              v-if="siteSettings.address"
              class="flex items-start gap-5"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9eee7] text-xl">
                📍
              </div>

              <div>
                <h3 class="font-semibold text-[#193b2b]">Our Location</h3>
                <p class="mt-1 whitespace-pre-line text-slate-600">
                  {{ siteSettings.address }}
                </p>
              </div>
            </div>

            <!-- Email -->
            <div
              v-if="siteSettings.contact_email"
              class="flex items-start gap-5"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9eee7] text-xl">
                ✉
              </div>

              <div>
                <h3 class="font-semibold text-[#193b2b]">Email Us</h3>
                <a
                  :href="`mailto:${siteSettings.contact_email}`"
                  class="mt-1 inline-block break-all text-slate-600 transition hover:text-[#9b8051]"
                >
                  {{ siteSettings.contact_email }}
                </a>
              </div>
            </div>

            <!-- Phone -->
            <div
              v-if="siteSettings.contact_phone"
              class="flex items-start gap-5"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9eee7] text-xl">
                ☎
              </div>

              <div>
                <h3 class="font-semibold text-[#193b2b]">Call Us</h3>
                <a
                  :href="`tel:${siteSettings.contact_phone.replace(/[^+\d]/g, '')}`"
                  class="mt-1 inline-block text-slate-600 transition hover:text-[#9b8051]"
                >
                  {{ siteSettings.contact_phone }}
                </a>
              </div>
            </div>

            <!-- Fallback -->
            <p
              v-if="!siteSettings.address && !siteSettings.contact_email && !siteSettings.contact_phone"
              class="rounded-xl bg-[#e9eee7] p-5 text-sm leading-7 text-slate-600"
            >
              Contact information will be available here soon.
            </p>

          </div>

          <div class="mt-12 rounded-2xl bg-[#193b2b] p-7 text-white">
            <p class="font-serif text-2xl">
              Your Nepal story starts here.
            </p>

            <p class="mt-3 text-sm leading-7 text-white/75">
              From peaceful villages to breathtaking Himalayan landscapes,
              let's find the journey that's right for you.
            </p>
          </div>
        </div>

        <!-- Contact form -->
        <div class="rounded-3xl border border-[#e9e6dc] bg-white p-6 shadow-sm md:p-10">

          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#9b8051]">
            Send An Inquiry
          </p>

          <h2 class="mt-3 font-serif text-3xl text-[#193b2b] md:text-4xl">
            Send Us A Message
          </h2>

          <p class="mt-3 text-sm leading-7 text-slate-500">
            Fill in the details below and our team will get back to you.
          </p>

          <form @submit.prevent="submitForm" class="mt-8 space-y-6">

            <!-- Name -->
            <div>
              <label for="name" class="mb-2 block text-sm font-semibold text-slate-700">
                Your Name *
              </label>

              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter your full name"
                autocomplete="name"
                required
                class="w-full rounded-xl border border-slate-200 bg-[#fafaf8] px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">
                Email Address *
              </label>

              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email address"
                autocomplete="email"
                required
                class="w-full rounded-xl border border-slate-200 bg-[#fafaf8] px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
              />
            </div>

            <!-- Destination -->
            <div>
              <label for="destination" class="mb-2 block text-sm font-semibold text-slate-700">
                Interested Destination
              </label>

              <select
                id="destination"
                v-model="selectedDestinationId"
                class="w-full rounded-xl border border-slate-200 bg-[#fafaf8] px-4 py-3.5 text-slate-800 outline-none transition focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
              >
                <option value="">
                  {{ loadingDestinations ? 'Loading destinations...' : 'Select a destination (optional)' }}
                </option>

                <option
                  v-for="destination in destinations"
                  :key="destination.id"
                  :value="destination.id"
                >
                  {{ destination.name }}
                </option>
              </select>
            </div>

            <!-- Subject -->
            <div>
              <label for="subject" class="mb-2 block text-sm font-semibold text-slate-700">
                Subject *
              </label>

              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="What would you like to know?"
                required
                class="w-full rounded-xl border border-slate-200 bg-[#fafaf8] px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="mb-2 block text-sm font-semibold text-slate-700">
                Your Message *
              </label>

              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                placeholder="Tell us about your plans or questions..."
                required
                class="w-full resize-none rounded-xl border border-slate-200 bg-[#fafaf8] px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#55745c] focus:ring-2 focus:ring-[#55745c]/10"
              ></textarea>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {{ error }}
            </div>

            <!-- Success -->
            <div
              v-if="submitted"
              class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              role="status"
            >
              Thank you for contacting {{ siteSettings.site_name }}!
              Your inquiry has been sent successfully.
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="submitting"
              class="flex w-full items-center justify-center gap-2 rounded-full bg-[#193b2b] px-7 py-4 font-semibold text-white transition hover:bg-[#2b5540] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ submitting ? 'Sending Message...' : 'Send Message' }}
              <span v-if="!submitting">→</span>
            </button>

            <p class="text-center text-xs text-slate-400">
              We appreciate your interest in exploring Nepal with us.
            </p>

          </form>
        </div>

      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bg-[#eaece4] px-6 py-20 text-center">
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#9b8051]">
          Discover Nepal
        </p>

        <h2 class="mt-4 font-serif text-4xl text-[#193b2b] md:text-5xl">
          Ready To Explore Nepal?
        </h2>

        <p class="mx-auto mt-5 max-w-xl leading-8 text-slate-600">
          Your next unforgettable adventure is waiting.
          Let's start planning your journey.
        </p>

        <RouterLink
          to="/booking"
          class="mt-8 inline-flex items-center justify-center rounded-full bg-[#193b2b] px-8 py-4 font-semibold text-white transition hover:bg-[#2b5540]"
        >
          Book Your Trip →
        </RouterLink>
      </div>
    </section>

  </main>
</template>
