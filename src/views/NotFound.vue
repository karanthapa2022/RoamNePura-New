
<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <div class="text-center">
      <p class="text-8xl font-bold text-emerald-600">404</p>

      <h1 class="mt-4 text-3xl font-bold text-gray-900">
        Page Not Found
      </h1>

      <p class="mt-3 text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <RouterLink
        to="/"
        class="inline-block mt-8 rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition"
      >
        Back to Homepage
      </RouterLink>
    </div>
  </main>
</template>
