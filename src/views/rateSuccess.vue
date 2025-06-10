<template>
    <div class="container">
        <div :class="['content', { mobile: isMobile }]">
            <div class="nav">
                <span class="title">Aura Cure</span>
            </div>
            <img class="message" src="/src/assets/img/message.svg" alt="" />
            <div style="margin-top: 80px; font-size: 26px">Review Submitted</div>
            <div style="margin-top: 30px; font-size: 34px">Thank you!</div>
            <div style="margin-top: 100px; font-size: 14px">View messages and discover clinics</div>
            <a-button type="primary" size="large" style="width: 100%; margin-top: 20px" @click="singIn">Sign up/ Log in</a-button>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { authClient } from '@/utils/supabase';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const singIn = async () => {
        let status = await authClient.getAuthenticationInfoOrNull();
        if (status) {
            router.push({ path: '/' });
        } else {
            authClient.redirectToLoginPage({
                postLoginRedirectUrl: import.meta.env.VITE_CLIENT_APP_URL || window.location.href,
            });
        }
    };
</script>
<style lang="scss" scoped>
    .container {
        background-color: #e1eee6;
        .title {
            color: #00796b;
        }
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 0;
        min-height: 100%;
        width: 100%;
        border-radius: 0;
        background-color: #e1eee6;
        color: #00796b;
    }
    .message {
        width: 150px;
    }
</style>
