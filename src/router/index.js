import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Destinations from "../views/Destinations.vue";
import Tours from "../views/Tours.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";



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
    ],
})
export default router
