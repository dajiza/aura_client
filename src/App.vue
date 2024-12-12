<template>
    <a-config-provider
        :theme="{
            token: {
                colorPrimary: '#00796B',
            },
        }"
    >
        <a-spin class="spin" :spinning="spinning" tip="LOADING..." size="large"> </a-spin>
        <div :class="['wrap', { 'bg-mobile': isMobile }]">
            <router-view v-slot="{ Component }" class="main" :key="route.fullPath">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
            <div class="foot">Powered by Aura Cure Inc.</div>
        </div>
    </a-config-provider>
</template>
<script setup>
    import { computed } from 'vue';
    import { useSpinStore } from './stores/modules/system/spin';
    import { useRoute } from 'vue-router';
    const route = useRoute();

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    let spinStore = useSpinStore();
    const spinning = computed(() => spinStore.loading);
</script>
<style lang="scss" scoped>
    .wrap {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: url('/src/assets/img/web-top.svg') no-repeat center top;
        background-color: $color-background;
        background-size: contain;
        &.bg-mobile {
            background: url('/src/assets/img/top.svg') no-repeat center top;
        }
        .main {
            height: calc(100vh - 50px);
        }
        .foot {
            height: 50px;
            color: rgba(0, 0, 0, 0.2);
            text-align: center;
            font-size: 12px;
            line-height: 50px;
        }
    }
</style>
