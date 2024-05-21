import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/verification"
    },
    {
        path: "/verification",
        name: "verification",
        component: () => import("../pages/Verification.vue"),
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("../pages/Profile.vue"),
        meta: {
            requiresAuth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem("token")) {
            next({
                path: "/verification",
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;