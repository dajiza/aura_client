<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title">Confirm your appointment</div>
            <div class="body">
                <div class="info">
                    <div class="time">{{ moment(date).format('MMM DD, YYYY') }} at {{ moment(start, 'HH:mm').format('h:mmA') }}</div>
                    <div style="font-size: 20px; margin-top: 20px">{{ serviceData.name }}</div>
                    <div style="font-size: 20px">with {{ staffData.first_name }} {{ staffData.last_name }}</div>
                    <a-button style="margin-top: 20px" type="primary" size="xs">${{ serviceData?.price?.toFixed(2) }}</a-button>
                </div>
                <div class="email">
                    <div style="font-weight: 500">Send me a reminder by</div>
                    <div>
                        <a-checkbox v-model:checked="needEmailReminder" style="margin-top: 20px">Email</a-checkbox>
                    </div>
                    <div>
                        <a-checkbox v-model:checked="isAgree" style="margin-top: 20px">I agree to the booking policy</a-checkbox>
                    </div>
                    <div class="policy-title" style="margin-top: 40px">Booking Policy</div>
                    <div class="policy-content">{{ serviceData.description_before }}</div>
                    <div class="policy-title">Practitioner’s Message</div>
                    <div class="policy-content">
                        {{ staffData.booking_introduction }}
                    </div>
                </div>
            </div>
            <a-button style="width: 80%; max-width: 400px; margin-top: auto" type="primary" size="large" @click="onContinue" :disabled="!isAgree">
                Confirm
            </a-button>
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
    import { message } from 'ant-design-vue';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid);
    const email = ref(route.query.email);
    const service = ref(route.query.service);
    const staff = ref(route.query.staff);
    const date = ref(route.query.date);
    const start = ref(route.query.start);
    const end = ref(route.query.end);
    const serviceData = ref({});
    const staffData = ref({});
    const isAgree = ref(false);
    const needEmailReminder = ref(true);

    const clinic = ref();
    const active = ref('');

    const onContinue = async () => {
        SmartLoading.show();
        let res = await scheduleStore.createSchedule({
            hid: hid.value,
            email: email.value,
            service: service.value,
            staff: staff.value,
            date: moment(date.value).format('YYYYMMDD'),
            start: start.value,
            end: end.value,
            need_email_reminder: needEmailReminder.value,
        });
        SmartLoading.hide();
        console.log('🚀 ~ onContinue ~ res:', res);
        if (res.success) {
            message.success('Booking successful');
            router.push({
                path: '/schedule/confirmed',
                query: { sid: res.data.sid },
            });
        } else {
            message.error(res.message);
        }
        // router.push({ path: '/schedule/date', query: { hid: hid.value, email: email.value, service: service.value, staff: active.value } });
    };
    onMounted(async () => {
        SmartLoading.show();
        clinic.value = await scheduleStore.getClinic(hid.value);
        serviceData.value = clinic.value?.services.find((item) => item.id == service.value);
        staffData.value = clinic.value?.staffs.find((item) => item.id == staff.value);
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
        max-height: calc(100% - 100px);
        width: 100%;
        .info {
            padding: 30px 20px;
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            .time {
                color: #009688;
            }
        }
        .email {
            padding: 30px 20px;
        }
        .policy-title {
            margin-top: 20px;
            color: #009688;
            font-size: 12px;
        }
        .policy-content {
            margin-top: 10px;
            font-size: 12px;
        }
    }
</style>
