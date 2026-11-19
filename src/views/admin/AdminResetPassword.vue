
<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { resetAdminPassword } from "../../api/adminAuth";

const route = useRoute();

const password = ref("");
const passwordConfirmation = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const hasResetDetails = computed(() => {
    return (
        typeof route.query.token === "string" &&
        typeof route.query.email === "string" &&
        route.query.token.length > 0 &&
        route.query.email.length > 0
    );
});

const handleSubmit = async () => {
    error.value = "";
    success.value = "";

    if (!hasResetDetails.value) {
        error.value = "This password reset link is invalid.";
        return;
    }

    if (password.value.length < 8) {
        error.value = "Your password must contain at least 8 characters.";
        return;
    }

    if (password.value !== passwordConfirmation.value) {
        error.value = "The password confirmation does not match.";
        return;
    }

    loading.value = true;

    try {
        const response = await resetAdminPassword({
            email: route.query.email,
            token: route.query.token,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        });

        success.value = response.data.message;
        password.value = "";
        passwordConfirmation.value = "";
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Unable to reset your password. Please request a new link.";
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
                    Create a new password
                </h2>

                <p class="mt-2 mb-6 text-sm text-[#6b756e]">
                    Choose a new password for your RoamNePura admin account.
                </p>

                <div
                    v-if="success"
                    class="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    {{ success }}

                    <div class="mt-3">
                        <RouterLink
                            to="/admin/login"
                            class="font-semibold underline"
                        >
                            Go to Admin Login
                        </RouterLink>
                    </div>
                </div>

                <div
                    v-if="error"
                    class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ error }}
                </div>

                <div
                    v-if="!hasResetDetails"
                    class="text-sm text-red-700"
                >
                    This password reset link is invalid or incomplete.
                    <div class="mt-4">
                        <RouterLink
                            to="/admin/forgot-password"
                            class="font-semibold text-[#1f5c3f] hover:underline"
                        >
                            Request a new reset link
                        </RouterLink>
                    </div>
                </div>

                <form
                    v-else-if="!success"
                    @submit.prevent="handleSubmit"
                    class="space-y-4"
                >

                    <div>
                        <label for="password" class="block text-sm font-medium text-[#1c2a22] mb-1.5">
                            New Password
                        </label>

                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            minlength="8"
                            autocomplete="new-password"
                            placeholder="Enter new password"
                            class="w-full rounded-[10px] border border-[#e7e3da] px-3.5 py-2.5 text-sm text-[#1c2a22] outline-none transition focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
                        />
                    </div>

                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium text-[#1c2a22] mb-1.5">
                            Confirm New Password
                        </label>

                        <input
                            id="password_confirmation"
                            v-model="passwordConfirmation"
                            type="password"
                            required
                            minlength="8"
                            autocomplete="new-password"
                            placeholder="Confirm new password"
                            class="w-full rounded-[10px] border border-[#e7e3da] px-3.5 py-2.5 text-sm text-[#1c2a22] outline-none transition focus:border-[#1f5c3f] focus:ring-3 focus:ring-[#e6f0ea]"
                        />
                    </div>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full rounded-[10px] bg-[#1f5c3f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194d35] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {{ loading ? "Resetting Password..." : "Reset Password" }}
                    </button>
                </form>

                <div v-if="!success" class="mt-6 text-center">
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
