<script setup>
import { ref, onMounted } from "vue";
import { adminLogin } from "../../api/adminAuth";
import { useRouter } from "vue-router";
import { useAuthStore } from '../../stores/authStore'

const router = useRouter();
const authStore = useAuthStore()
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
onMounted(() => {
    success.value = sessionStorage.getItem("admin_message") || "";
    sessionStorage.removeItem("admin_message");
});

const handleLogin = async () => {
    error.value = "";
    loading.value = true;

    try {
        const response = await adminLogin({
            email: email.value,
            password: password.value,
        });

        authStore.setToken(response.data.token);
sessionStorage.setItem("admin_message", "Login successful! Welcome back.");
await router.push("/admin/dashboard");
    } catch (err) {
        console.error(err);
        error.value = "Unable to sign in. Please check your credentials.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">

    <div class="w-full max-w-md">

      <!-- Brand -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-12 h-12 rounded-xl bg-[#1f5c3f] flex items-center justify-center text-white text-xl"
        >
          ▲
        </div>

        <h1 class="mt-4 font-serif text-3xl font-semibold text-[#1c2a22]">
          Roam<span class="text-[#1f5c3f]">NePura</span>
        </h1>

        <p class="mt-2 text-sm text-[#6b756e]">
          Admin Panel
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border border-[#e7e3da] rounded-xl p-6 sm:p-8 shadow-sm">

        <div class="mb-6">
          <h2 class="font-serif text-2xl text-[#1c2a22]">
            Welcome back
          </h2>

          <p class="mt-1 text-sm text-[#6b756e]">
            Sign in to manage RoamNePura.
          </p>
        </div>
        
<!-- Success notification -->
<div
  v-if="success"
  class="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
>
  {{ success }}
</div>


        <!-- Error -->
        <div
          v-if="error"
          class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>


        <form @submit.prevent="handleLogin" class="space-y-4">

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[#1c2a22] mb-1.5"
            >
              Email
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="admin@roamnepura.com"
              class="w-full rounded-[10px] border border-[#e7e3da] px-3.5 py-2.5 text-sm text-[#1c2a22] outline-none transition focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[#1c2a22] mb-1.5"
            >
              Password
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              class="w-full rounded-[10px] border border-[#e7e3da] px-3.5 py-2.5 text-sm text-[#1c2a22] outline-none transition focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-[10px] bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194d35] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>

        </form>
      </div>

      <p class="mt-6 text-center text-xs text-[#6b756e]">
        RoamNePura Admin
      </p>

    </div>
  </div>
</template>
