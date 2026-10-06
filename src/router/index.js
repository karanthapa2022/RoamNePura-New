import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Destinations from "../views/Destinations.vue";
import Tours from "../views/Tours.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Booking from "../views/Booking.vue";
import AdminLayout from "../layouts/AdminLayout.vue";



const router= createRouter({
    history: createWebHistory(),
    routes:[
        {
        path: '/',
        component: Home,
    },
    
   
        { 
            path:'/destinations',
            component: Destinations,
        },
    
        {
            path:'/tours',
            component: Tours,
        },
    
        {
            path:'/about',
            component: About,
        },
    
        {
            path:'/contact',
            component: Contact,
        },
        {
            path:'/booking',
            component: Booking,
        },
        {
    path: "/admin",
    component: AdminLayout,
    children: [
        {
            path: "",
            redirect: "/admin/dashboard",
        },
        {
            path: "dashboard",
            component: {
                template: `
                    <div>
                        <h2 class="font-serif text-3xl text-[#1c2a22]">
                            Dashboard
                        </h2>
                        <p class="mt-2 text-[#6b756e]">
                            Welcome to the RoamNePura admin dashboard.
                        </p>
                    </div>
                `,
            },
        },
    ],
},
    ],
})
export default router
