<template>
    <div class="container">Redirecting...</div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { authClient, authInfo } from '@/utils/supabase';
    import router from '@/routers/index';

    if (authInfo) {
        router.push({ path: '/' });
    } else {
        authClient.redirectToSignupPage({
            postSignupRedirectUrl: window.location.href || import.meta.env.CLIENT_APP_URL,
        });
    }
    onMounted(async () => {});
</script>
<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
    }
</style>
