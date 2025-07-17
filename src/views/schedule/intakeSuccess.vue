<template>
    <div class="container">
        <div class="nav">
            <!-- <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" /> -->
            <span class="head">{{ clinic?.detail?.name }}</span>
            <CloseOutlined class="close-icon" @click="() => router.push('/')" />
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="body">
                <div class="status">
                    <div class="status-title">Thank you for completing your intake form</div>
                    <img src="/src/assets/img/check.png" alt="" style="width: 48px; height: 48px; margin: 50px auto" />
                </div>
            </div>
            <!-- 
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: auto">
                <a-button style="width: 80%; max-width: 400px; margin-top: auto" type="primary" size="large" @click="onContinue">
                    Book another time
                </a-button>
                <a-button style="width: 80%; max-width: 400px; margin-top: 20px" size="large" @click="onClose"> Close </a-button>
            </div> -->
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { useScheduleStore } from '@/stores/modules/schedule';
    import { useRoute } from 'vue-router';
    import moment from 'moment-timezone';
    import { localRead } from '@/utils/local-util';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid || localRead('hid'));

    const clinic = ref();

    const onContinue = async () => {
        router.push({ path: '/schedule/index', query: { hid: hid.value } });
    };
    // const onClose = async () => {
    //     window.close();
    // };
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
        width: 100%;
        .status {
            text-align: center;
            .status-title {
                margin-top: 20px;
                color: #009688;
                font-weight: 400;
                font-size: 26px;
            }
        }
    }
</style>
