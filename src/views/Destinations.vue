<script setup>
import {ref, computed} from 'vue'
const searchQuery= ref('')

const destinations=[
   { name: 'Ruby Valley',
    image:'/images/IMG_6464.jpg',
    description:'Experience stunning mountain views along with endless trails.'},
    {
    name: 'Pokhara',
    image:'/images/IMG_6464.jpg',
    description:'Discover peaceful lakes, mountain views, and unforgettable adventures.'
    },
    {
      name: 'Kathmandu Valley',
    image:'/images/IMG_6464.jpg',
    description:'Explore ancient temples, rich culture, and the heart of Nepal.'  
    }
]
const filteredDestinations=computed(()=>{
    return destinations.filter(destination=>
        destination.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})
</script>

<template>
   <section class="relative min-h-[60vh]">

    <img src="/images/IMG_6933.jpg" alt="Beautiful Landscape" 
    class="absolute inset-0 h-full w-full object-cover object-center">

    <!--Dark Overlay-->
    <div class="absolute inset-0 bg-black/40">

    </div>
    <div class="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p class="text-lg font-semibold text-white">
            Explore Nepal
        </p>
        <h1 class="mt-2 text-4xl font-bold text-white md:text-6xl"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.45);">
            Discover your Next Destination
        </h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-white">
            From peaceful valleys to breathtaking mountains, discover the places that make Nepal unforgettable.
        </p>
    </div>

   </section>

   <section class="px-6 py-16">
    <div class="mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-slate-800 md:text-4xl">
            Explore Destinations
        </h2>
        <p class="mt-3 max-w-2xl text-slate-600">
            Find the perfect destination for your next adventure in Nepal.
        </p>

        <div>
            <input
            v-model="searchQuery"
            type="text" placeholder="Search destinations..." 
            class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-green-100">
        </div>
        
    </div>
    <div class="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
        <div v-for="destination in filteredDestinations"
        :key="destination.name"
        class="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        
            <div class="h-56 overflow-hidden">
                    <img 
                    :src="destination.image" 
                    :alt="destination.name"
                    class="h-full w-full object-cover">
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold text-slate-800">{{ destination.name }}</h3>
                <p class="mt-2 text-slate-600">
                    {{ destination.description }}
                </p>
                <RouterLink to="/destinations"
                class="mt-4 inline-block font-semibold text-green-700 hover:text-green-800">
                    Explore →
                </RouterLink>
            </div>
        </div>
            <!--No results-->
        <p 
        v-if="filteredDestinations.length===0"
        class="col-span-full py-10 text-center text-slate-500">
            No destination found.
        </p>
    </div>

   </section>
</template>