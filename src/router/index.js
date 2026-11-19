import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("../views/Home.vue"),
    },
    {
        path: "/destinations",
        component: () => import("../views/Destinations.vue"),
    },
    {
        path: "/destinations/:slug",
        component: () => import("../views/public/destinations/DestinationDetails.vue"),
    },
    {
        path: "/tours",
        component: () => import("../views/Tours.vue"),
    },
    {
        path: "/tours/:slug",
        component: () => import("../views/public/tours/TourDetails.vue"),
    },
    {
        path: "/about",
        component: () => import("../views/About.vue"),
    },
    {
        path: "/contact",
        component: () => import("../views/Contact.vue"),
    },
    {
        path: "/booking",
        component: () => import("../views/Booking.vue"),
    },
    {
        path: "/bookings",
        redirect: "/booking",
    },
    {
        path: "/admin/login",
        component: () => import("../views/admin/AdminLogin.vue"),
    },
    {
        path: "/admin/forgot-password",
        component: () => import("../views/admin/AdminForgotPassword.vue"),
    },
    {
        path: "/admin/reset-password",
        component: () => import("../views/admin/AdminResetPassword.vue"),
    },
    {
        path: "/admin",
        component: () => import("../Layouts/AdminLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                redirect: "/admin/dashboard",
            },
            {
                path: "dashboard",
                component: () => import("../views/admin/AdminDashboard.vue"),
            },
            {
                path: "notifications",
                component: () => import("../views/admin/AdminNotifications.vue"),
            },
            {
                path: "destinations",
                component: () => import("../views/admin/AdminDestinations.vue"),
            },
            {
                path: "destinations/create",
                component: () => import("../views/admin/AdminDestinationCreate.vue"),
            },
            {
                path: "destinations/:id/edit",
                component: () => import("../views/admin/AdminDestinationEdit.vue"),
            },
            {
                path: "tours",
                component: () => import("../views/admin/AdminTours.vue"),
            },
            {
                path: "tours/create",
                component: () => import("../views/admin/AdminTourForm.vue"),
            },
            {
                path: "tours/:id/edit",
                component: () => import("../views/admin/AdminTourForm.vue"),
            },
            {
                path: "bookings",
                component: () => import("../views/admin/AdminBookings.vue"),
            },
            {
                path: "inquiries",
                component: () => import("../views/admin/AdminInquiries.vue"),
            },
            {
                path: "reviews",
                component: () => import("../views/admin/AdminReviews.vue"),
            },
            {
                path: "settings",
                component: () => import("../views/admin/AdminSettings.vue"),
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("../views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

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

export default router;
