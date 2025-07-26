<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title" style="font-weight: bold">Have you visited our clinic before?</div>
            <div class="body">
                <div class="box">
                    <a-button style="width: 100%" type="primary" size="large" :ghost="!(active == 'yes')" @click="() => (active = 'yes')">
                        Yes
                    </a-button>
                </div>
                <div class="box">
                    <a-button style="width: 100%" type="primary" size="large" :ghost="!(active == 'no')" @click="() => (active = 'no')">
                        No
                    </a-button>
                </div>
                <a-form class="form" layout="vertical" style="margin-bottom: 40px" v-if="active == 'yes'">
                    <a-form-item label="Enter your email*" :validate-status="validateStatus" :help="validateHelp">
                        <a-input v-model:value="email" placeholder="Enter here" />
                    </a-form-item>
                </a-form>
            </div>
            <a-button
                style="width: 80%; max-width: 400px; margin-top: auto"
                type="primary"
                size="large"
                @click="onContinue"
                :disabled="continueDisabled"
                >Continue</a-button
            >
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

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid);

    const clinic = ref();
    const active = ref('');
    const email = ref('');
    const validateStatus = ref('');
    const validateHelp = ref('');
    const continueDisabled = computed(() => {
        if (active.value == '') {
            return true;
        }
        if (active.value == 'yes' && !email.value) {
            return true;
        }
        return false;
    });

    const onContinue = async () => {
        if (active.value == 'no') {
            router.push({ path: '/schedule/profile', query: { hid: hid.value } });
            return;
        }
        if (active.value == 'yes') {
            SmartLoading.show();
            let res = await scheduleStore.queryPatient({ hid: hid.value, email: email.value });
            console.log('🚀 ~ onContinue ~ res:', res);
            if (!res.detail) {
                validateStatus.value = 'error';
                validateHelp.value = 'Can’t find your profile ';
            } else {
                console.log('🚀 ~ onContinue ~ else:');
                router.push({ path: '/schedule/service', query: { hid: hid.value, email: email.value } });
            }
            SmartLoading.hide();
            return;
        }
    };
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
        // text-align: center;
        flex-grow: 1;
        margin-top: 30px;
        padding-top: 40px;
        max-height: calc(100% - 100px);
        width: 100%;
        border-top: 1px solid #d9d9d9;
        .box {
            margin-bottom: 20px;
        }
    }
</style>
