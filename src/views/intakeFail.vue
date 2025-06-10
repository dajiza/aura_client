<template>
    <div class="container">
        <div class="top">
            <div class="title">{{ hospital.name }}</div>
            <div class="info">{{ hospital.address }}</div>
            <div class="info">{{ hospital.email }}</div>
            <div class="info">{{ hospital.phone }}</div>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div style="color: #00796b; font-size: 26px; margin-top: 40px; text-align: center">
                <p>This intake form is linked to a different email.</p>
                <p style="margin-top: 40px">Please sign in or create an account using the email that received the request.</p>
                <a-button type="primary" style="margin-top: 100px" @click="retry">Sign out and Retry</a-button>
            </div>
        </div>
    </div>
</template>
<script setup>
    import LoginDrawer from '@/components/LoginDrawer.vue';
    const loginDrawer = ref();
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/modules/system/user';
    import { supabase, authClient } from '@/utils/supabase';
    import { clearAllCoolies } from '@/utils/cookie-util';

    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    // let pid = ref(route.query.pid);
    let hid = ref(route.query.hid);
    let hospital = ref({});
    let patient = ref({});
    // const hid = ref(useUserStore().getHid);

    const retry = () => {
        console.log('🚀 ~ retry ~ import.meta.env.CLIENT_APP_URL:', import.meta.env.CLIENT_APP_URL);

        authClient.logout();
        clearAllCoolies();
        useUserStore().logout();
        authClient.redirectToLoginPage({
            postLoginRedirectUrl: import.meta.env.CLIENT_APP_URL,
        });
    };

    const getData = async () => {
        SmartLoading.show();
        if (hid.value) {
            let { data: hospitalData } = await supabase.from('hospitals').select('*').eq('hid', hid.value);
            hospital.value = hospitalData[0];
        }
        SmartLoading.hide();
    };
    onMounted(async () => {
        await getData();
    });
</script>
<style lang="scss" scoped>
    .container {
        .top {
            padding: 20px;
            color: #fff;
            text-align: center;
            .title {
                margin-bottom: 10px;
                font-size: 20px;
            }
            .info {
                line-height: 20px;
            }
        }
        .content {
            text-align: center;
        }
    }
</style>
