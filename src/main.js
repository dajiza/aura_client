import { createApp } from 'vue';
import 'virtual:svg-icons-register';

import App from './App.vue';
import routers from './routers';
import stores from './stores';
import directives from './directives';
import '@/styles/index.scss';
import { Button, message, Input, ConfigProvider, Form, Spin } from 'ant-design-vue';
import { supabase, authInfo } from '@/utils/supabase';
import { localRead, localSave } from '@/utils/local-util';
import { getTokenFromCookie } from '@/utils/cookie-util';
import { useUserStore } from '@/stores/modules/system/user';
import router from '@/routers/index';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import * as antIcons from '@ant-design/icons-vue';
/**
 * 获取用户信息和用户权限对应的路由，构建动态路由
 */
async function getLoginInfo() {
    try {
        let { user } = authInfo;
        let { data: userSupabase } = await supabase.from('users').select().eq('id', authInfo.user.userId).single();

        // 新用户创建数据
        if (!userSupabase) {
            let res = await supabase
                .from('users')
                .insert({
                    id: user.userId,
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    role: 'patient',
                })
                .select();
            userSupabase = res.data[0];
        }
        // let { data: hospital } = await supabase.from('hospitals').select('*').eq('hid', userSupabase.hid).single();

        let userData = {
            uid: user.userId,
            avatar: userSupabase.avatar,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role: userSupabase.role,
            marketing: userSupabase.marketing ? 1 : 0,
        };

        localSave('role', userData.role);
        initVue();
        useUserStore().setUserLoginInfo(userData);
        // router.push('/');

        // if (!hospital) {
        //     message.warning('Please create a clinic first');
        // } else {
        //     let hospitalData = {
        //         hid: hospital.hid,
        //         h_name: hospital.name,
        //         is_subscription: hospital?.subscription_name ? true : false,
        //     };
        //     useUserStore().setHospitalInfo(hospitalData);
        //     // router.push('/home');
        // }
    } catch (e) {
        message.error(e);
        initVue();
    }
}
function initVue() {
    let vueApp = createApp(App);
    let app = vueApp.use(Antd).use(routers).use(stores).use(directives);
    // 注册图标组件
    Object.keys(antIcons).forEach((key) => {
        app.component(key, antIcons[key]);
    });
    //全局
    app.config.globalProperties.$antIcons = antIcons;

    //挂载
    app.mount('#app');
}
let token = getTokenFromCookie();
if (!token) {
    initVue();
} else {
    getLoginInfo();
}
