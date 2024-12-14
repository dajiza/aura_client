<template>
    <div class="container">Redirecting...</div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { authClient } from '@/utils/supabase';
    authClient.redirectToSignupPage({
        postLoginRedirectUrl: import.meta.env.PROPELAUTH_REDIRECT_URL || window.location.href,
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
