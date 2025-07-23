<template>
    <div class="container">
        <div class="nav">
            <!-- <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" /> -->
            <span class="head">{{ clinic?.detail?.name }}</span>
            <CloseOutlined class="close-icon" @click="() => router.push('/')" />
        </div>
        <div :class="['content', { mobile: isMobile }]">
            <div class="body">
                <div class="info">
                    <div class="time">
                        {{ moment(detail.date).format('MMM DD, YYYY') }} at {{ moment(detail.start_time, 'HH:mm').format('h:mmA') }}
                    </div>
                    <div style="font-size: 20px; margin-top: 20px">{{ serviceData.name }}</div>
                    <div style="font-size: 20px">with {{ staffData.first_name }} {{ staffData.last_name }}</div>
                    <a-button style="margin-top: 20px" type="primary" size="xs">${{ serviceData?.price?.toFixed(2) }}</a-button>
                </div>
                <div class="email">
                    <div style="font-size: 16px; color: rgba(60, 60, 67, 0.6)">Patient info</div>
                    <div style="margin-top: 15px">
                        <UserOutlined style="margin-right: 6px" /> {{ detail.patient?.first_name }} {{ detail.patient?.last_name }}
                    </div>
                    <div style="margin-top: 15px"><MailOutlined style="margin-right: 6px" /> {{ detail.patient?.email }}</div>
                    <div style="margin-top: 15px"><PhoneOutlined style="margin-right: 6px" /> {{ detail.patient?.phone }}</div>
                    <div style="font-size: 16px; color: rgba(60, 60, 67, 0.6); margin-top: 30px">Clinic info</div>
                    <div style="margin-top: 15px"><UserOutlined style="margin-right: 6px" /> {{ clinic?.detail?.name }}</div>
                    <div style="margin-top: 15px"><EnvironmentOutlined style="margin-right: 6px" /> {{ clinic?.detail?.address }}</div>
                    <div style="margin-top: 15px"><MailOutlined style="margin-right: 6px" /> {{ clinic?.detail?.email }}</div>
                    <div style="margin-top: 15px"><PhoneOutlined style="margin-right: 6px" /> {{ clinic?.detail?.phone }}</div>
                </div>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: auto">
                <a-button style="width: 80%; max-width: 400px; margin-top: auto" type="primary" size="large" @click="gotoIntake" v-if="showIntake">
                    Fill out intake form
                </a-button>
                <a-button style="width: 80%; max-width: 400px; margin-top: auto" type="primary" size="large" @click="exportPdf" v-if="!showIntake">
                    View my intake form
                </a-button>
                <a-button danger style="width: 80%; max-width: 400px; margin-top: 20px" size="large" v-if="detail.status == 0" @click="onCancel">
                    Cancel or Reschedule
                </a-button>
            </div>
        </div>
    </div>
    <IntakePdf
        id="intake-pdf"
        :fields="fields"
        :consent="consent"
        :formState="intakeForm"
        :patient="detail.patient"
        :hospital="clinic?.detail"
    ></IntakePdf>
</template>
<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { useScheduleStore } from '@/stores/modules/schedule';
    import { useRoute } from 'vue-router';
    import moment from 'moment-timezone';
    import { Modal, message } from 'ant-design-vue';
    import IntakePdf from '@/views/pdf/IntakePdf.vue';
    import { downloadPdf } from '@/utils/pdf';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();

    const sid = ref(route.query.sid);
    const serviceData = ref({});
    const staffData = ref({});
    const detail = ref({});

    const clinic = ref();
    const showIntake = ref(true);

    const fields = ref([]);
    const consent = ref('');
    const intakeForm = ref({});

    const gotoIntake = async () => {
        router.push({ path: '/schedule/intake', query: { hid: detail.value.hid, pid: detail.value.patient.pid } });
    };
    const onCancel = async () => {
        Modal.confirm({
            title: 'Cancel appointment?',
            okText: 'Confirm',
            cancelText: 'Back',
            okType: 'danger',
            onOk: async () => {
                await scheduleStore.cancelSchedule({ sid: sid.value });
                message.success('Cancel successful');
                router.push({ path: '/schedule/canceled', query: { hid: detail.value.hid, email: detail.value.patient.email } });
            },
        });
    };
    const getDetail = async () => {
        let res = await scheduleStore.queryScheduleDetail({ sid: sid.value });
        if (!res.detail) {
            router.push({ path: '/schedule/canceled' });
        }
        detail.value = res.detail;
    };
    const exportPdf = async () => {
        SmartLoading.show();
        let time = moment().tz(clinic.value.detail.timezone).format('MMM DD, YYYY, HH:mm A');
        await downloadPdf('intake-pdf', `Intake form for ${detail.value.patient.first_name} ${detail.value.patient.last_name}`, time);
        SmartLoading.hide();
        message.success('Pdf exported successfully!');
    };
    onMounted(async () => {
        SmartLoading.show();
        await getDetail();
        clinic.value = await scheduleStore.getClinic(detail.value.hid);
        serviceData.value = clinic.value?.services.find((item) => item.id == detail.value.service.id);
        staffData.value = clinic.value?.staffs.find((item) => item.id == detail.value.practitioner.id);

        let { detail: intakeData } = await scheduleStore.queryIntake({ pid: detail.value.patient.pid });
        intakeForm.value = intakeData;
        showIntake.value = intakeData ? false : true;

        fields.value = clinic.value.detail.intake_fields || [];
        consent.value = clinic.value.detail.intake_consent || '';

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
        // max-height: calc(100% - 100px);
        width: 100%;
        .status {
            text-align: center;
            .status-title {
                margin-top: 20px;
                color: #009688;
                font-weight: 400;
                font-size: 20px;
            }
        }
        .info {
            padding: 30px 20px;
            // border-top: 1px solid #d9d9d9;
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
        }
        .policy-content {
            margin-top: 10px;
        }
    }
</style>
