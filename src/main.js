import { createApp } from 'vue';
import 'virtual:svg-icons-register';

import App from './App.vue';
import routers from './routers';
import stores from './stores';
import directives from './directives';
import '@/styles/index.scss';
import { message } from 'ant-design-vue';
import { authInfo, supabase, bootSupabase } from '@/utils/supabase';
import { localSave } from '@/utils/local-util';
import { useUserStore } from '@/stores/modules/system/user';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import * as antIcons from '@ant-design/icons-vue';

const userAgent = navigator.userAgent || navigator.vendor || window.opera;
let isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
let vueMounted = false;

/**
 * 获取用户信息和用户权限对应的路由，构建动态路由
 */
async function getLoginInfo() {
    if (!authInfo?.user || !supabase) return;

    try {
        let { user } = authInfo;
        let { data: userSupabase } = await supabase.from('users').select('*').eq('id', user.userId).maybeSingle();

        // Legacy rows may key off email instead of the current PropelAuth user id.
        if (!userSupabase && user.email) {
            const byEmail = await supabase.from('users').select('*').eq('email', user.email).maybeSingle();
            userSupabase = byEmail.data;
        }

        if (!userSupabase) {
            const res = await supabase
                .from('users')
                .insert({
                    id: user.userId,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    role: 'patient',
                })
                .select('*')
                .maybeSingle();
            userSupabase = res.data;
        }

        // Fallback: PropelAuth id may not match a legacy users.id (unique email blocks insert).
        let userData = {
            uid: user.userId,
            avatar: userSupabase?.avatar,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role: userSupabase?.role || 'patient',
            marketing: userSupabase?.marketing ? 1 : 0,
            isMobile,
            hid: userSupabase?.hid,
        };

        localSave('role', userData.role);
        useUserStore().setUserLoginInfo(userData);
    } catch (e) {
        console.error('getLoginInfo failed', e);
        message.error(e?.message || 'Failed to load user profile');
    }
}

function initVue() {
    if (vueMounted) return;
    vueMounted = true;
    let vueApp = createApp(App);
    let app = vueApp.use(Antd).use(routers).use(stores).use(directives);
    Object.keys(antIcons).forEach((key) => {
        app.component(key, antIcons[key]);
    });
    app.config.globalProperties.$antIcons = antIcons;
    app.mount('#app');
}

async function boot() {
    // Auth first, then mount Pinia/app, then write uid. Intake must not see an
    // empty uid or it will redirectToLoginPage in a loop.
    await bootSupabase();
    initVue();
    if (authInfo?.user) {
        // Set uid immediately so intake onMounted does not bounce to login.
        useUserStore().setUserLoginInfo({
            uid: authInfo.user.userId,
            email: authInfo.user.email,
            first_name: authInfo.user.firstName,
            last_name: authInfo.user.lastName,
            role: 'patient',
            isMobile,
        });
        await getLoginInfo();
    }
}

boot().catch((error) => {
    console.error('boot failed', error);
    initVue();
});
