import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Destinations from "../views/Destinations.vue";
import Tours from "../views/Tours.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Booking from "../views/Booking.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminLogin from "../views/admin/AdminLogin.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminDestinations from "../views/admin/AdminDestinations.vue";
import AdminDestinationCreate from "../views/admin/AdminDestinationCreate.vue";
import AdminDestinationEdit from "../views/admin/AdminDestinationEdit.vue";
import DestinationDetails from "../views/public/destinations/DestinationDetails.vue";
import AdminInquiries from "../views/admin/AdminInquiries.vue";


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
    path: "/destinations/:slug",
    component: DestinationDetails,
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
    path: "/admin/login",
    component: AdminLogin,
},

        {
            
    path: "/admin",
    component: AdminLayout,
    meta: {requiresAuth: true},
    children: [
        
        {
            path: "",
            redirect: "/admin/dashboard",
        },
        {
  path: "dashboard",
  component: AdminDashboard,
},
{
  path: "destinations",
  component: AdminDestinations,
},
{
  path: "destinations/create",
  component: AdminDestinationCreate,
},
{
  path: "destinations/:id/edit",
  component: AdminDestinationEdit,
},
{ path: "inquiries", component: AdminInquiries },
{
  path: "tours",
  component: {
    template: `
      <div>
        <h2 class="font-serif text-3xl text-[#1c2a22]">
          Tours
        </h2>
        <p class="mt-2 text-[#6b756e]">
          Manage RoamNePura tours here.
        </p>
      </div>
    `,
  },
},
{
  path: "bookings",
  component: {
    template: `
      <div>
        <h2 class="font-serif text-3xl text-[#1c2a22]">
          Bookings
        </h2>
        <p class="mt-2 text-[#6b756e]">
          Manage customer bookings here.
        </p>
      </div>
    `,
  },
},
{
  path: "settings",
  component: {
    template: `
      <div>
        <h2 class="font-serif text-3xl text-[#1c2a22]">
          Settings
        </h2>
        <p class="mt-2 text-[#6b756e]">
          Manage admin settings here.
        </p>
      </div>
    `,
  },
},
],},],})
router.beforeEach((to) => {
    const isAuthenticated = Boolean(
        sessionStorage.getItem("admin_token")
    );

    const requiresAuth = to.matched.some(
        (record) => record.meta.requiresAuth
    );

    if (requiresAuth && !isAuthenticated) {
        return "/admin/login";
    }
});
export default router
