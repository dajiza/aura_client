<template>
    <div class="container">Redirecting...</div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { authClient } from '@/utils/supabase';
    console.log('🚀 ~ window.location.href:', window.location.href);
    console.log('🚀 ~ import.meta.env.CLIENT_APP_URL:', import.meta.env.CLIENT_APP_URL);

    authClient.redirectToSignupPage({
        postSignupRedirectUrl: window.location.href || import.meta.env.CLIENT_APP_URL,
    });
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
