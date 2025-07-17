<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title">Choose a practitioner</div>
            <div class="body">
                <div class="box" v-for="item in staffsFilter" :key="item.id">
                    <a-button style="width: 100%" type="primary" size="large" :ghost="!(active == item.id)" @click="() => (active = item.id)">
                        {{ item.first_name }} {{ item.last_name }}
                    </a-button>
                </div>
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
    const email = ref(route.query.email);
    const service = ref(route.query.service);

    const clinic = ref();
    const active = ref('');
    const continueDisabled = computed(() => {
        if (!active.value) {
            return true;
        }
        return false;
    });
    const staffsFilter = computed(() => {
        return clinic.value?.staffs ? clinic.value.staffs.filter((item) => item?.service_list?.includes(service.value)) : [];
    });

    const onContinue = async () => {
        router.push({ path: '/schedule/date', query: { hid: hid.value, email: email.value, service: service.value, staff: active.value } });
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
