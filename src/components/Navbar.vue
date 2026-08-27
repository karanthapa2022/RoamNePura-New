<script setup>  
import {ref} from 'vue'
const menuOpen= ref(false)
const closeMenu=()=>{
    menuOpen.value=false
}

</script>

<template>
    <nav class="flex flex-wrap justify-between items-center px-6 py-4 bg-slate-50">
        <div class="flex justify-between items-center w-full md:w-auto">
        <!--Brand-->
        <RouterLink to="/" class="text-2xl font-bold text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
        > 
            RoamNePura
        </RouterLink>

        <!--Mobile Button-->
        <button class="md:hidden text-2xl text-slate-700 hover:text-green-700 transition"
        @click="menuOpen= !menuOpen"
        >
        <span v-if="!menuOpen"> ☰</span>
        <span v-else> X</span>
        </button>
        </div>
            <!--Desktop Navigation-->
        <div class="hidden md:flex gap-6 text-slate-700">
        <RouterLink to="/" class="transition hover:text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
        
        >Home</RouterLink>
        <RouterLink to="/destinations" class="transition hover:text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
        
        >Destinations</RouterLink>
        <RouterLink to="/tours" class="transition hover:text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
       
        >Tours</RouterLink>
        <RouterLink to="/about" class="transition hover:text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
       
        >About</RouterLink>
        <RouterLink to="/contact" class="transition hover:text-green-700 hover:underline underline-offset-4"
        active-class="text-green-700 underline underline-offset-4"
        
        >Contact</RouterLink>
        </div>
        <div 
        v-if="menuOpen" class="flex flex-col gap-4 w-full md:hidden pt-4 border-t">
            <RouterLink to="/" active-class="text-green-700 underline underline-offset-4" 
            class=" py-2 transition hover:text-green-700 hover:underline underline-offset-4"
            @click="closeMenu">
            Home</RouterLink>
            <RouterLink to="/destinations"
            class=" py-2 transition hover:text-green-700 hover:underline underline-offset-4"
            active-class="text-green-700 underline underline-offset-4"
            @click="closeMenu">
                Destinations</RouterLink>
            <RouterLink to="/tours"
            class="py-2 transition hover:text-green-700 hover:underline underline-offset-4"
            active-class="text-green-700 underline underline-offset-4"
            @click="closeMenu">
            Tours</RouterLink>
            <RouterLink to="/about" class="py-2 transition hover:text-green-700 hover:underline underline-offset-4"
            active-class="text-green-700 underline underline-offset-4"
            @click="closeMenu">
            About</RouterLink>
            <RouterLink to="/contact"
            class="py-2 transition hover:text-green-700 hover:underline underline-offset-4"
            active-class="text-green-700 underline underline-offset-4"
            @click="closeMenu">
            Contact</RouterLink>
        </div>
    </nav>
</template>