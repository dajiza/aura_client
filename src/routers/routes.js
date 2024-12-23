// 页面路由
export default [
    {
        path: '/:pathMatch(.*)',
        name: 'all',
        meta: {
            title: 'Home',
        },
        component: () => import('@/views/home.vue'),
    },
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'Home',
        },
        component: () => import('@/views/home.vue'),
    },
    {
        path: '/blog',
        name: 'blog',
        meta: {
            title: 'Blog',
        },
        component: () => import('@/views/blog.vue'),
    },
    {
        path: '/discover',
        name: 'discover',
        meta: {
            title: 'Discover',
        },
        component: () => import('@/views/discover.vue'),
    },
    {
        path: '/clinic',
        name: 'clinic',
        meta: {
            title: 'Clinic',
        },
        component: () => import('@/views/clinic.vue'),
    },
    {
        path: '/past',
        name: 'past',
        meta: {
            title: 'Past Visits',
        },
        component: () => import('@/views/past.vue'),
    },
    {
        path: '/note',
        name: 'note',
        meta: {
            title: 'Note',
        },
        component: () => import('@/views/pastDetail.vue'),
    },
    {
        path: '/rate-list',
        name: 'rate-list',
        meta: {
            title: 'Rate',
        },
        component: () => import('@/views/rateList.vue'),
    },
    {
        path: '/rate-page',
        name: 'rate-page',
        meta: {
            title: 'Rate',
        },
        component: () => import('@/views/ratePage.vue'),
    },
    {
        path: '/rate-success',
        name: 'rate-success',
        meta: {
            title: 'Rate Success',
        },
        component: () => import('@/views/rateSuccess.vue'),
    },

    // web
    {
        path: '/web/',
        name: 'web-home',
        meta: {
            title: 'Home',
        },
        component: () => import('@/views/web/home.vue'),
    },
    {
        path: '/web/discover',
        name: 'web-discover',
        meta: {
            title: 'Discover',
        },
        component: () => import('@/views/web/discover.vue'),
    },
    {
        path: '/web/blog',
        name: 'web-blog',
        meta: {
            title: 'Blog',
        },
        component: () => import('@/views/web/blog.vue'),
    },
    {
        path: '/web/clinic',
        name: 'web-clinic',
        meta: {
            title: 'Clinic',
        },
        component: () => import('@/views/web/clinic.vue'),
    },
    {
        path: '/web/past',
        name: 'web-past',
        meta: {
            title: 'Past Visits',
        },
        component: () => import('@/views/web/past.vue'),
    },
    {
        path: '/web/note',
        name: 'web-note',
        meta: {
            title: 'Note',
        },
        component: () => import('@/views/web/pastDetail.vue'),
    },
    {
        path: '/web/rate-list',
        name: 'web-rate-list',
        meta: {
            title: 'Rate',
        },
        component: () => import('@/views/web/rateList.vue'),
    },
    {
        path: '/web/rate-page',
        name: 'web-rate-page',
        meta: {
            title: 'Rate',
        },
        component: () => import('@/views/web/ratePage.vue'),
    },
    {
        path: '/web/rate-success',
        name: 'web-rate-success',
        meta: {
            title: 'Rate Success',
        },
        component: () => import('@/views/web/rateSuccess.vue'),
    },
    {
        path: '/web/signup',
        name: 'web-signup',
        meta: {
            title: 'Sign Up',
        },
        component: () => import('@/views/signup.vue'),
    },
    {
        path: '/signup',
        name: 'signup',
        meta: {
            title: 'Sign Up',
        },
        component: () => import('@/views/signup.vue'),
    },
];
