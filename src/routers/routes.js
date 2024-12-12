// 页面路由
export default [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import('@/views/blog.vue'),
    },
    {
        path: '/discover',
        name: 'discover',
        component: () => import('@/views/discover.vue'),
    },
    {
        path: '/clinic',
        name: 'clinic',
        component: () => import('@/views/clinic.vue'),
    },
    {
        path: '/past',
        name: 'past',
        component: () => import('@/views/past.vue'),
    },
    {
        path: '/note',
        name: 'note',
        component: () => import('@/views/pastDetail.vue'),
    },
    // {
    //     path: '/rate',
    //     name: 'rate',
    //     component: () => import('@/views/rate.vue'),
    // },
    {
        path: '/rate-list',
        name: 'rate-list',
        component: () => import('@/views/rateList.vue'),
    },

    {
        path: '/web/',
        name: 'web-home',
        component: () => import('@/views/web/home.vue'),
    },
    {
        path: '/web/discover',
        name: 'web-discover',
        component: () => import('@/views/web/discover.vue'),
    },
    {
        path: '/web/blog',
        name: 'web-blog',
        component: () => import('@/views/web/blog.vue'),
    },
    {
        path: '/web/clinic',
        name: 'web-clinic',
        component: () => import('@/views/web/clinic.vue'),
    },
    {
        path: '/web/past',
        name: 'web-past',
        component: () => import('@/views/web/past.vue'),
    },
    {
        path: '/web/note',
        name: 'web-note',
        component: () => import('@/views/web/pastDetail.vue'),
    },
    {
        path: '/web/rate-list',
        name: 'web-rate-list',
        component: () => import('@/views/web/rateList.vue'),
    },
];
