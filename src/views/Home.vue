<script setup>
import AppButton from '../components/ui/AppButton.vue'
   </script>
<template>
    <section class=" relative min-h-screen">
        <img src="/images/IMG_6933.jpg" 
        alt="Beautiful landscape"
        class="absolute inset-0 w-full h-full object-cover object-center">

        
        <!--Dark overlay-->
        <div class="absolute inset-0 bg-black/40">
        </div>
        <div class="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6 py-4 fade-in">
            <p class="text-lg font-semibold text-white">Explore Nepal</p>
            <h1 class="mt-2 mb-4 text-4xl md:text-6xl font-bold text-white max-w-4xl"
            style="text-shadow: 0 2px 8px rgba(0,0,0,0.45);">Your Next Adventure Starts Here</h1>
            <p class="max-w-2xl text-lg leading-relaxed text-white">Discover breathtaking destinations, unforgettable experiences,
                and the beauty of Nepal.</p>
                
<RouterLink
    to="/destinations"
    custom
    v-slot="{ navigate }"
>
    <AppButton
        variant="light"
        class="mt-8"
        @click="navigate"
    >
        Explore Destinations
    </AppButton>
</RouterLink>
        </div>
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
            <p class="text-sm">Scroll to explore</p>
            <div class="h-8">
            <span class=" inline-block text-xl bounce-arrow">↓</span></div>
        </div>
    </section>

    <section class="px-6 py-16">
        <div class="mx-auto max-w-6xl text-center">


            <p class="font-semibold text-green-700">
                Discover Nepal
            </p>

            <h2 class="mx-auto mt-4 max-w-2xl text-slate-800 md:text-4xl">
                Featured Destinations

            </h2>

            <p class="mx-auto mt-4 max-w-2xl text-slate-600">
                Explore some of Nepal's most beautiful destinations and start planning your next adventure.
            </p>
        </div>

        <div class="mx-auto mt-10 grid max-w-6xl items-stretch gap-6 md:grid-cols-3">
            <!--Card 1: Ruby valley-->
            <div class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div class="h-56 overflow-hidden">
                    <img src="/images/IMG_6464.jpg" alt="Ruby Valley"
                    class="h-full w-full object-cover">
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-bold text-slate-800">
                        Ruby Valley
                     </h3>
                     <p class="mt-2 text-slate-600"> 
                        Experience stunning mountains views along with endless trails.
                     </p>
                     <RouterLink to="/destinations"
                     class="mt-4 inline-block font-semibold text-green-700 hover:text-green-800">
                        Explore →
                     </RouterLink>
                </div>
            </div>
            <!--Card 2: Pokhara-->
            <div class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div class="h-56 overflow-hidden">
                    <img src="/images/IMG_6464.jpg" alt="Ruby Valley"
                    class="h-full w-full object-cover">
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-bold text-slate-800">
                        Pokhara
                     </h3>
                     <p class="mt-2 text-slate-600"> 
                        Experience peaceful lakes, stunning mountain views,
            and unforgettable adventures.
                     </p>
                     <RouterLink to="/destinations"
                     class="mt-4 inline-block font-semibold text-green-700 hover:text-green-800">
                        Explore →
                     </RouterLink>
                </div>
            </div>
            <!--Card 3: North ABC-->
            <div class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div class="h-56 overflow-hidden">
                    <img src="/images/IMG_6464.jpg" alt="Ruby Valley"
                    class="h-full w-full object-cover">
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-bold text-slate-800">
                        North ABC
                     </h3>
                     <p class="mt-2 text-slate-600"> 
                        Experience stunning mountains views, waterfalls, rivers along with endless trails.
                     </p>
                     <RouterLink to="/destinations"
                     class="mt-4 inline-block font-semibold text-green-700 hover:text-green-800">
                        Explore →
                     </RouterLink>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-slate-50 px-6 py-16">
        <div class="mx-auto max-w-6xl text-center">
            <p class="font-semibold text-green-700">
                Why RoamNePura?
            </p>
            <h2 class="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                Travel With Confidence
            </h2>
            <div class="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
                <div class="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div class="text-4xl">
                        🏔️
                    </div>
                    <h3 class="mt-4 text-xl font-bold text-slate-800">
                        Authentic Experiences
                    </h3>
                    <p class="mt-2 text-slate-600">
                        Discover the real beauty, culture, and adventures
                        that make Nepal unforgettable.
                    </p>
                </div>
                <div class="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div class="text-4xl">⏱️</div>
                    <h3 class="mt-4 text-xl font-bold text-slate-800">
                        Easy Planning
                    </h3>
                    <p class="mt-2 text-slate-600">
                        Plan your trip with simple options designed to make your Nepal journey stress-free.
                    </p>
                </div>
                <div class="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

    <div class="text-4xl">
        ❤️
    </div>

    <h3 class="mt-4 text-xl font-bold text-slate-800">
        Memorable Journeys
    </h3>

    <p class="mt-2 text-slate-600">
        Create lasting memories through experiences
        you'll remember long after your trip.
    </p>

</div>

            </div>


            <p class="mx-auto mt-4 max-w-2xl text-slate-600">
                We make it easier to discover Nepal, plan your journey, and create unforgettable memories.
            </p>

            
        </div>
    </section>

    <section class="px-6 py-20">
        <div class="mx-auto max-w-5xl rounded-2xl bg-green-700 px-6 py-16 text-center">
            <h2 class="text-3xl font-bold text-white md:text-4xl">
                Ready to Explore Nepal?
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-green-50">
                Your next adventure is waiting. Discover amazing destinations and start planning your journey today.
            </p>
            <RouterLink to="/destinations"
            class="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
                Explore Destinations
            </RouterLink>
        </div>
    </section>
</template>