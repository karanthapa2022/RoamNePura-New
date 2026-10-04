<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)

const submitForm = () => {
  submitted.value = true

  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>

<template>
  <!-- Hero Section -->
  <section class="relative min-h-[55vh]">

    <img
      src="/images/IMG_6933.jpg"
      alt="Nepal mountains"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/45"></div>

    <div
      class="relative z-10 flex min-h-[55vh] flex-col items-center justify-center px-6 text-center"
    >
      <p class="text-lg font-semibold text-white">
        Get In Touch
      </p>

      <h1
        class="mt-2 text-4xl font-bold text-white md:text-6xl"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.45);"
      >
        Contact Us
      </h1>

      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white">
        Have a question about Nepal or planning your next adventure?
        We'd love to hear from you.
      </p>
    </div>

  </section>


  <!-- Contact Section -->
  <section class="px-6 py-16">

    <div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">

      <!-- Contact Information -->
      <div>

        <p class="font-semibold text-green-700">
          Let's Talk
        </p>

        <h2 class="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
          We'd Love To Hear From You
        </h2>

        <p class="mt-4 leading-relaxed text-slate-600">
          Whether you have a question about our tours, need help planning
          your trip, or simply want to learn more about Nepal, feel free
          to reach out to us.
        </p>


        <!-- Contact Details -->
        <div class="mt-8 space-y-6">

          <!-- Location -->
          <div class="flex items-start gap-4">

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"
            >
              📍
            </div>

            <div>
              <h3 class="font-bold text-slate-800">
                Location
              </h3>

              <p class="mt-1 text-slate-600">
                Kathmandu, Nepal
              </p>
            </div>

          </div>


          <!-- Email -->
          <div class="flex items-start gap-4">

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"
            >
              ✉
            </div>

            <div>
              <h3 class="font-bold text-slate-800">
                Email
              </h3>

              <p class="mt-1 text-slate-600">
                info@roamnepura.com
              </p>
            </div>

          </div>


          <!-- Phone -->
          <div class="flex items-start gap-4">

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"
            >
              ☎
            </div>

            <div>
              <h3 class="font-bold text-slate-800">
                Phone
              </h3>

              <p class="mt-1 text-slate-600">
                +977 98XXXXXXXX
              </p>
            </div>

          </div>

        </div>

      </div>


      <!-- Contact Form -->
      <div class="rounded-2xl bg-white p-6 shadow-lg md:p-8">

        <h2 class="text-2xl font-bold text-slate-800">
          Send Us A Message
        </h2>

        <p class="mt-2 text-slate-600">
          Fill out the form and we'll get back to you soon.
        </p>


        <form
          @submit.prevent="submitForm"
          class="mt-6 space-y-5"
        >

          <!-- Name -->
          <div>

            <label
              for="name"
              class="mb-2 block font-medium text-slate-700"
            >
              Your Name
            </label>

            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Enter your name"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Email -->
          <div>

            <label
              for="email"
              class="mb-2 block font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Subject -->
          <div>

            <label
              for="subject"
              class="mb-2 block font-medium text-slate-700"
            >
              Subject
            </label>

            <input
              id="subject"
              v-model="form.subject"
              type="text"
              placeholder="What can we help you with?"
              required
              class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <!-- Message -->
          <div>

            <label
              for="message"
              class="mb-2 block font-medium text-slate-700"
            >
              Message
            </label>

            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              placeholder="Tell us about your trip..."
              required
              class="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            ></textarea>

          </div>


          <!-- Submit -->
          <button
            type="submit"
            class="w-full rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Send Message
          </button>

        </form>


        <!-- Success Message -->
        <div
          v-if="submitted"
          class="mt-5 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700"
        >
          Thanks for reaching out! We'll get back to you soon.
        </div>

      </div>

    </div>

  </section>


  <!-- CTA -->
  <section class="bg-slate-50 px-6 py-16 text-center">

    <div class="mx-auto max-w-3xl">

      <h2 class="text-3xl font-bold text-slate-800 md:text-4xl">
        Ready To Explore Nepal?
      </h2>

      <p class="mt-4 text-lg text-slate-600">
        Have your destination in mind? Start planning your adventure with us.
      </p>

      <RouterLink
        to="/booking"
        class="mt-7 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
      >
        Book Your Trip
      </RouterLink>

    </div>

  </section>
</template>
