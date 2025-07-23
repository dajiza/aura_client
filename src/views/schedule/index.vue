<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title" style="font-weight: bold">Booking Policy</div>
            <div class="body" style="white-space: pre-wrap" v-html="clinic?.detail?.booking_policy"></div>
            <a-button
                style="width: 80%; max-width: 400px; margin-top: auto"
                type="primary"
                size="large"
                @click="() => router.push({ path: '/schedule/visited', query: { hid } })"
                v-if="clinic?.detail?.booking_enable"
            >
                Continue to booking
            </a-button>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { useScheduleStore } from '@/stores/modules/schedule';
    import { useRoute } from 'vue-router';
    import { localSave } from '@/utils/local-util';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid);
    localSave('hid', hid.value);

    const clinic = ref();

    onMounted(async () => {
        SmartLoading.show();
        clinic.value = await scheduleStore.getClinic(hid.value);
        SmartLoading.hide();
    });
</script>
<style lang="scss" scoped>
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .head {
        margin: 0 auto;
        text-align: center;
        font-weight: 400;
        font-size: 16px;
    }
    .body {
        overflow-y: auto;
        flex-grow: 1;
        margin-top: 20px;
        max-height: calc(100% - 100px);
        width: 100%;
        text-align: center;
    }
</style>
