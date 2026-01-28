<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title" style="font-weight: bold">Choose a service</div>
            <div class="body">
                <div class="box" v-for="item in servicesFilter" :key="item.id">
                    <a-button
                        class="btn"
                        style="width: 100%; height: auto"
                        type="primary"
                        size="large"
                        :ghost="!(active == item.id)"
                        @click="() => (active = item.id)"
                    >
                        {{ item.name }} ({{ item.duration }} mins)
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
    const staff = ref(route.query.staff);

    const clinic = ref();
    const active = ref('');
    const continueDisabled = computed(() => {
        if (!active.value) {
            return true;
        }
        return false;
    });
    const servicesFilter = computed(() => {
        // 诊所数据还没拿到时，直接返回空数组，避免报错
        if (!clinic.value) return [];

        const allServices = clinic.value.servicesForBooking || [];

        // 没有预选 staff，则显示全部 service
        if (!staff.value) {
            return allServices;
        }

        // 根据路由里的 staff id 找到当前 staff
        const currentStaff = clinic.value.staffsForBooking?.find((s) => s.id === staff.value);

        // 找不到或没配置 service_list，就返回空
        if (!currentStaff || !Array.isArray(currentStaff.service_list) || currentStaff.service_list.length === 0) {
            return [];
        }

        // 用 staff 的 service_list（serviceId 列表）过滤 service
        return allServices.filter((service) => currentStaff.service_list.includes(service.id));
    });

    const onContinue = async () => {
        if (staff.value) {
            router.push({ path: '/schedule/date', query: { hid: hid.value, email: email.value, service: active.value, staff: staff.value } });
        } else {
            router.push({ path: '/schedule/staff', query: { hid: hid.value, email: email.value, service: active.value } });
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
    .btn {
        ::v-deep span {
            white-space: normal;
        }
    }
</style>
