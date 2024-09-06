import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/views/UserLogin.vue';
import UserRegister from '@/views/UserRegister.vue';
import PhotoManager from '@/views/PhotoManager.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const routes = [
    {
        path: '/',
        redirect: '/photo-manager',
        component: MainLayout,
        children: [
            {
                path: '/photo-manager',
                name: 'PhotoManager',
                component: PhotoManager,
            },
        ],
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: UserLogin,
    },
    {
        path: '/register',
        name: 'register',
        component: UserRegister,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;