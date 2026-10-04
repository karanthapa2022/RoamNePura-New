
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { createBooking } from '../services/bookingApi'

const route = useRoute()

const tours = {
  'everest-base-camp': 'Everest Base Camp',
  'annapurna-circuit': 'Annapurna Circuit',
  'upper-mustang': 'Upper Mustang',
  'pokhara-adventure': 'Pokhara Adventure',
  'chitwan-safari': 'Chitwan Safari',
  'kathmandu-cultural-tour': 'Kathmandu Cultural Tour'
}

const selectedTour = computed(() => {
  return tours[route.query.tour] || 'Selected Tour'
})

const name = ref('')
const email = ref('')
const phone = ref('')
const travelDate = ref('')
const travelers = ref(1)
const message = ref('')

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submitBooking = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!name.value || !email.value || !phone.value || !travelDate.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  loading.value = true

  try {
    await createBooking({
      name: name.value,
      email: email.value,
      phone: phone.value,
      tour: selectedTour.value,
      travel_date: travelDate.value,
      travelers: travelers.value,
      message: message.value
    })

    successMessage.value =
      'Your booking request has been submitted successfully!'

    name.value = ''
    email.value = ''
    phone.value = ''
    travelDate.value = ''
    travelers.value = 1
    message.value = ''

  } catch (error) {
    console.error(error)

    errorMessage.value =
      'Something went wrong. Please try again.'

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 py-20">

    <div class="max-w-6xl mx-auto px-6">

      <div class="max-w-2xl mb-12">
        <p class="text-sm uppercase tracking-[0.25em] text-gray-500">
          Start Your Journey
        </p>

        <h1 class="text-4xl md:text-5xl font-bold mt-2">
          Book Your Tour
        </h1>

        <p class="mt-5 text-gray-600 text-lg">
          Tell us about your travel plans and we'll get back to you
          with the details.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div class="lg:col-span-2">

          <form
            @submit.prevent="submitBooking"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >

            <h2 class="text-2xl font-bold">
              Your Information
            </h2>

            <div
              v-if="successMessage"
              class="mt-6 p-4 rounded-xl bg-green-50 text-green-700"
            >
              {{ successMessage }}
            </div>

            <div
              v-if="errorMessage"
              class="mt-6 p-4 rounded-xl bg-red-50 text-red-700"
            >
              {{ errorMessage }}
            </div>

            <div class="mt-8">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                v-model="name"
                type="text"
                placeholder="Enter your full name"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  v-model="phone"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>

                <input
                  v-model="travelDate"
                  type="date"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>

                <input
                  v-model.number="travelers"
                  type="number"
                  min="1"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

            </div>

            <div class="mt-6">

              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>

              <textarea
                v-model="message"
                rows="5"
                placeholder="Tell us anything we should know about your trip..."
                class="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black resize-none"
              ></textarea>

            </div>

            <button
              type="submit"
              :disabled="loading"
              class="mt-8 w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Sending...' : 'Send Booking Request' }}
            </button>

          </form>

        </div>

        <div>

          <div
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 sticky top-8"
          >

            <p class="text-sm uppercase tracking-[0.2em] text-gray-500">
              Booking Inquiry
            </p>

            <h2 class="text-2xl font-bold mt-2">
              Your Adventure
            </h2>

            <div class="mt-6 pt-6 border-t border-gray-200">

              <p class="text-sm text-gray-500">
                Selected Tour
              </p>

              <p class="font-semibold text-lg mt-1">
                {{ selectedTour }}
              </p>

            </div>

            <div class="mt-6 p-5 bg-gray-50 rounded-xl">

              <p class="text-gray-600 text-sm leading-relaxed">
                Submit your details and our team will contact you
                to confirm availability, pricing, and the next steps.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </main>
</template>

