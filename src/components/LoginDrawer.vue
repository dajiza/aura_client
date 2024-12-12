<template>
    <a-drawer
        v-model:open="open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        title="Menu"
        placement="left"
        @after-open-change="afterOpenChange"
    >
        <div class="menu-list">
            <div class="menu-item" @click="home">
                <div class="icon-box"><img src="/src/assets/img/home.svg" alt="" class="icon" /></div>
                Home
            </div>

            <div class="menu-item" v-if="uid" @click="past">
                <div class="icon-box"><img src="/src/assets/img/past.svg" alt="" class="icon" /></div>
                My past visits
            </div>
            <div class="menu-item" @click="discover">
                <div class="icon-box"><img src="/src/assets/img/discover.svg" alt="" class="icon" /></div>
                Discover
            </div>
            <div class="menu-item" @click="account" v-if="uid">
                <div class="icon-box"><img src="/src/assets/img/account.svg" alt="" class="icon" /></div>
                Account
            </div>
            <div class="menu-item" @click="singIn" v-if="!uid">
                <div class="icon-box"><img src="/src/assets/img/account.svg" alt="" class="icon" /></div>
                Sign in
            </div>
            <div class="menu-item menu-border" @click="logout" v-if="uid">
                <div class="icon-box"><img src="/src/assets/img/out.svg" alt="" class="icon" /></div>
                Sign out
            </div>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
    import { onMounted, ref, reactive, toRaw } from 'vue';
    import { authInfo, authClient, supabase } from '@/utils/supabase';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { clearAllCoolies } from '@/utils/cookie-util';
    import { localClear } from '@/utils/local-util';
    const uid = ref(useUserStore().getUid);

    const open = ref(false);
    const openModal = async () => {
        open.value = true;
    };
    const closeModal = async () => {
        open.value = false;
    };
    const afterOpenChange = () => {};
    const singIn = () => {
        authClient.redirectToLoginPage({
            postLoginRedirectUrl: import.meta.env.PROPELAUTH_REDIRECT_URL || 'http://localhost:8989/',
        });
    };
    const logout = () => {
        authClient.logout();
        localClear();
        clearAllCoolies();
        useUserStore().logout();
        router.push({ path: '/' });
        closeModal();
    };
    const home = () => {
        router.push({ path: '/' });
        closeModal();
    };
    const discover = () => {
        router.push({ path: '/discover' });
        closeModal();
    };
    const past = () => {
        router.push({ path: '/past' });
        closeModal();
    };
    const account = () => {
        authClient.redirectToAccountPage({
            redirectBackToUrl: window.location.href,
        });
    };
    defineExpose({
        openModal,
    });
</script>

<style lang="scss" scoped>
    .menu-item {
        display: flex;
        align-items: center;
        height: 56px;
        color: #000;
        font-size: 16px;
        &.menu-border {
            border-top: 1px solid #e1eee6;
        }
        .icon-box {
            margin-right: 20px;
            width: 24px;
            .icon {
                margin: 0 auto;
            }
        }
    }
</style>
