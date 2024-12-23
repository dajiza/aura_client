import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import routes from './routes';

const userAgent = navigator.userAgent || navigator.vendor || window.opera;
let isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
});

// import.meta.env.BASE_URL
const router = createRouter({
    history: createWebHistory(),
    routes,
    strict: true,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    document.title = `${to.meta.title} | Aura Cure` || 'Aura Cure';

    let pathArr = to.path.split('/');
    if (isMobile && pathArr[1] == 'web') {
        pathArr.splice(1, 1);
        to.path = pathArr.join('/');
        next({ path: to.path, query: to.query });
    } else if (!isMobile && pathArr[1] != 'web') {
        next({ path: '/web' + to.path, query: to.query });
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
