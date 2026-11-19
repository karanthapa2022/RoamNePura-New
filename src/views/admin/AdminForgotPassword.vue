<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { requestPasswordReset } from "../../api/adminAuth";

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleSubmit = async () => {
    error.value = "";
    success.value = "";
    loading.value = true;

    try {
        const response = await requestPasswordReset(email.value);
        success.value = response.data.message;
    } catch (err) {
        if (err.response?.status === 422) {
            error.value = "Please enter a valid email address.";
        } else {
            error.value = "Unable to process your request. Please try again.";
        }
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
                <div class="mx-auto w-12 h-12 rounded-xl bg-[#1f5c3f] flex items-center justify-center text-white text-xl">
                    ▲
                </div>

                <h1 class="mt-4 font-serif text-3xl font-semibold text-[#1c2a22]">
                    Roam<span class="text-[#1f5c3f]">NePura</span>
                </h1>

                <p class="mt-2 text-sm text-[#6b756e]">
                    Admin Password Recovery
                </p>
            </div>

            <!-- Form Card -->
            <div class="bg-white border border-[#e7e3da] rounded-xl p-6 sm:p-8 shadow-sm">

                <h2 class="font-serif text-2xl text-[#1c2a22]">
                    Forgot your password?
                </h2>

                <p class="mt-2 mb-6 text-sm text-[#6b756e]">
                    Enter your admin email address. If it belongs to an admin account,
                    we'll send you a password reset link.
                </p>

                <div
                    v-if="success"
                    class="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    {{ success }}
                </div>

                <div
                    v-if="error"
                    class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">

                    <div>
                        <label for="email" class="block text-sm font-medium text-[#1c2a22] mb-1.5">
                            Admin Email
                        </label>

                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            autocomplete="email"
                            placeholder="Enter your email"
                            class="w-full rounded-[10px] border border-[#e7e3da] px-3.5 py-2.5 text-sm text-[#1c2a22] outline-none transition focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
                        />
                    </div>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full rounded-[10px] bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194d35] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {{ loading ? "Sending..." : "Send Reset Link" }}
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <RouterLink
                        to="/admin/login"
                        class="text-sm font-medium text-[#1f5c3f] hover:underline"
                    >
                        ← Back to Admin Login
                    </RouterLink>
                </div>
            </div>

            <p class="mt-6 text-center text-xs text-[#6b756e]">
                RoamNePura Admin
            </p>
        </div>
    </div>
</template>
