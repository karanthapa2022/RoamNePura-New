import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Destinations from "../views/Destinations.vue";
import Tours from "../views/Tours.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Booking from "../views/Booking.vue";
import AdminLayout from "../Layouts/AdminLayout.vue";
import AdminLogin from "../views/admin/AdminLogin.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminDestinations from "../views/admin/AdminDestinations.vue";
import AdminDestinationCreate from "../views/admin/AdminDestinationCreate.vue";
import AdminDestinationEdit from "../views/admin/AdminDestinationEdit.vue";
import DestinationDetails from "../views/public/destinations/DestinationDetails.vue";
import AdminInquiries from "../views/admin/AdminInquiries.vue";
import AdminBookings from "../views/admin/AdminBookings.vue";
import AdminTours from "../views/admin/AdminTours.vue";
import AdminTourForm from "../views/admin/AdminTourForm.vue";
import TourDetails from "../views/public/tours/TourDetails.vue";
import AdminSettings from "../views/admin/AdminSettings.vue";

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
    path: "/tours/:slug",
    component: TourDetails,
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
{
    path: "tours",
    component: AdminTours,
},
{
    path: "tours/create",
    component: AdminTourForm,
},
{
    path: "tours/:id/edit",
    component: AdminTourForm,
},
{
    path: "bookings",
    component: AdminBookings,
},
{ path: "inquiries", component: AdminInquiries },
{
  path: "settings",
  component: AdminSettings,
},
],},],})
router.beforeEach((to) => {
    const token = sessionStorage.getItem("admin_token");

    const requiresAuth = to.matched.some(
        (record) => record.meta.requiresAuth
    );

    if (requiresAuth && !token) {
        return "/admin/login";
    }

    if (to.path === "/admin/login" && token) {
        return "/admin/dashboard";
    }
});
export default router
