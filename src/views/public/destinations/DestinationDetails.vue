<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getDestination } from "../../../api/destinations";

const route = useRoute();

const destination = ref(null);
const loading = ref(false);
const error = ref("");

const fetchDestination = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response = await getDestination(route.params.slug);

        destination.value = response.data;

        console.log("Destination details:", response.data);
    } catch (err) {
        console.error(err);

        error.value =
            err.response?.data?.message ||
            "Unable to load destination.";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchDestination();
});
</script>

<template>
    <div class="px-4 py-8 sm:px-6 lg:p-10">

        <!-- Loading -->
        <div v-if="loading">
            Loading destination...
        </div>

        <!-- Error -->
        <div v-else-if="error">
            {{ error }}
        </div>

        <!-- Destination -->
        <div v-else-if="destination">

            <!-- Back Button -->
            <div class="mb-6 flex justify-end">
                <RouterLink
                    to="/destinations"
                    class="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-100 hover:text-green-800"
                >
                    <span class="text-lg leading-none">←</span>
                    <span>Back to Destinations</span>
                </RouterLink>
            </div>

            <!-- Hero Image -->
            <div class="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                    :src="
                        destination.image
                            ? `http://127.0.0.1:8000/storage/${destination.image}`
                            : '/images/IMG_6464.jpg'
                    "
                    :alt="destination.name"
                    class="h-[320px] w-full object-cover sm:h-[380px] lg:h-[420px]"
                />

                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                ></div>

                <div class="absolute bottom-0 left-0 p-5 text-white sm:p-8">
                    <p
                        class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/80"
                    >
                        Explore Nepal
                    </p>

                    <h1 class="text-4xl font-bold md:text-5xl">
                        {{ destination.name }}
                    </h1>

                    <p
                        v-if="destination.location"
                        class="mt-3 text-base text-white/90"
                    >
                        📍 {{ destination.location }}
                    </p>
                </div>
            </div>

            <!-- About Destination -->
            <div class="mt-10 max-w-4xl">
                <p
                    class="text-sm font-semibold uppercase tracking-[0.18em] text-green-700"
                >
                    About the Destination
                </p>

                <h2
                    class="mt-2 text-3xl font-bold text-slate-800 md:text-4xl"
                >
                    Discover {{ destination.name }}
                </h2>

                <p class="mt-5 text-lg leading-8 text-slate-600">
                    {{ destination.description }}
                </p>
            </div>

            <!-- Destination Information -->
            <div class="mt-10 grid gap-5 sm:grid-cols-3">

                <!-- Location -->
                <div
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl"
                    >
                        📍
                    </div>

                    <p class="mt-5 text-sm font-medium text-slate-500">
                        Location
                    </p>

                    <p class="mt-1 text-lg font-semibold text-slate-800">
                        {{ destination.location || "Not specified" }}
                    </p>
                </div>

                <!-- Duration -->
                <div
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl"
                    >
                        🕐
                    </div>

                    <p class="mt-5 text-sm font-medium text-slate-500">
                        Duration
                    </p>

                    <p class="mt-1 text-lg font-semibold text-slate-800">
                        {{ destination.duration || "Not specified" }}
                    </p>
                </div>

                <!-- Best Time -->
                <div
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl"
                    >
                        ☀️
                    </div>

                    <p class="mt-5 text-sm font-medium text-slate-500">
                        Best Time to Visit
                    </p>

                    <p class="mt-1 text-lg font-semibold text-slate-800">
                        {{ destination.best_time || "Not specified" }}
                    </p>
                </div>

            </div>

            <!-- Highlights -->
            <div class="mt-12 rounded-2xl bg-green-50 p-7 md:p-8">

                <div class="flex items-center gap-3">
                    <div class="h-8 w-1 rounded-full bg-green-700"></div>

                    <div>
                        <p
                            class="text-sm font-semibold uppercase tracking-[0.18em] text-green-700"
                        >
                            Don't Miss
                        </p>

                        <h2
                            class="mt-1 text-2xl font-bold text-slate-800 md:text-3xl"
                        >
                            Destination Highlights
                        </h2>
                    </div>
                </div>

                <p
                    v-if="destination.highlights"
                    class="mt-6 max-w-4xl text-lg leading-8 text-slate-600"
                >
                    {{ destination.highlights }}
                </p>

                <p
                    v-else
                    class="mt-6 text-slate-500"
                >
                    No highlights available.
                </p>

            </div>
            <!-- Call To Action -->
<div class="mt-10 overflow-hidden rounded-2xl bg-[#1f5c3f] p-8 text-white md:p-10">

    <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

        <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-green-100">
                Ready to Explore?
            </p>

            <h2 class="mt-2 text-3xl font-bold md:text-4xl">
                Plan Your {{ destination.name }} Adventure
            </h2>

            <p class="mt-3 max-w-2xl text-green-50/90">
                Have questions or want to plan your trip?
                Get in touch with our team and let's make it happen.
            </p>
        </div>

        <RouterLink
    :to="{
        path: '/contact',
        query: {
            destination: destination.name,
        },
    }"
    class="shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-[#1f5c3f] shadow-sm transition hover:bg-green-50"
>
    Plan Your Trip →
</RouterLink>

    </div>

</div>

        </div>

    </div>
</template>