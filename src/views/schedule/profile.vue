<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div style="text-align: center; margin-top: 10px">Create your profile</div>
            <div class="line"></div>
            <a-form class="form" ref="formRef" :model="formState" :rules="rules" layout="vertical">
                <a-form-item label="First name" name="first_name">
                    <a-input v-model:value="formState.first_name" />
                </a-form-item>
                <a-form-item label="Last name" name="last_name">
                    <a-input v-model:value="formState.last_name" />
                </a-form-item>
                <a-form-item label="Middle name">
                    <a-input v-model:value="formState.middle_name" />
                </a-form-item>
                <a-form-item label="Date of birth" name="birth">
                    <a-date-picker
                        class="width-full"
                        v-model:value="formState.birth"
                        format="MMDDYYYY"
                        value-format="YYYYMMDD"
                        placeholder="MMDDYYYY"
                    />
                    <div class="tips">MMDDYYYY</div>
                </a-form-item>
                <a-form-item label="Gender" name="gender">
                    <a-select v-model:value="formState.gender">
                        <a-select-option value="0">Male</a-select-option>
                        <a-select-option value="1">Female</a-select-option>
                        <a-select-option value="2">Prefer not to say</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Phone number" name="phone">
                    <a-input-group style="display: flex" compact>
                        <a-select v-model:value="formState.phone_prefix">
                            <a-select-option value="+1">+1</a-select-option>
                        </a-select>
                        <a-input v-model:value="formState.phone" />
                    </a-input-group>
                </a-form-item>
                <a-form-item label="Email" name="email">
                    <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item label="Insurance Provider">
                    <a-input v-model:value="formState.insurance_provider" />
                </a-form-item>
                <a-form-item label="Insurance Policy ID">
                    <a-input v-model:value="formState.insurance_no" />
                </a-form-item>
                <a-form-item label="Insurance Member Certificate.">
                    <a-input v-model:value="formState.insurance_certificate" />
                </a-form-item>

                <a-form-item class="btns" :wrapper-col="{ span: 24, offset: 0 }">
                    <a-button
                        style="width: 100%"
                        type="primary"
                        size="large"
                        @click="onSubmit"
                        :disabled="!checked && fields.includes('Consent and signature')"
                    >
                        Save and continue
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useRoute } from 'vue-router';
    import { message } from 'ant-design-vue';
    import { useUserStore } from '@/stores/modules/system/user';
    import _ from 'lodash';
    const userStore = useUserStore();
    import moment from 'moment-timezone';
    let { isMobile } = userStore;
    import { useScheduleStore } from '@/stores/modules/schedule';

    const scheduleStore = useScheduleStore();
    const route = useRoute();
    const hid = ref(route.query.hid);
    const pid = ref(route.query.pid);
    const hospital = ref({});
    const patient = ref({});
    const fields = ref([]);
    const consent = ref('');
    const signaturePad = ref();
    const checked = ref(false);
    const formRef = ref();
    const clinic = ref();

    let formState = ref({
        first_name: '',
        last_name: '',
        middle_name: '',
        birth: '',
        gender: '',
        phone_prefix: '+1',
        phone: '',
        email: '',
        insurance_provider: '',
        insurance_no: '',
        insurance_certificate: '',
    });
    const rules = {
        first_name: [
            { required: true, message: 'Please fill out', trigger: 'change' },
            { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
        ],
        last_name: [
            { required: true, message: 'Please fill out', trigger: 'change' },
            { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
        ],
        birth: [{ required: true, message: 'Please fill out', trigger: 'change' }],
        gender: [{ required: true, message: 'Please fill out', trigger: 'change' }],
        phone: [{ required: true, message: 'Please fill out', trigger: 'change' }],
        email: [{ required: true, message: 'Please fill out', trigger: 'change' }],
    };

    const onSubmit = () => {
        SmartLoading.show();
        formRef.value
            .validate()
            .then(async () => {
                let form = _.cloneDeep(formState.value);
                form.birth = form.birth ? moment(form.birth).format('YYYYMMDD') : '';

                form.hid = hid.value;
                let res = await scheduleStore.createPatient(form);
                SmartLoading.hide();
                let { success, message: msg, data } = res;
                if (!success) {
                    message.warning(msg);
                    return;
                }
                message.success('Patient profile created!');
                router.push({ path: '/schedule/service', query: { hid: hid.value, email: data[0].email } });
            })
            .catch((error) => {
                console.log('error', error);
                message.warning('Please fill out');
                SmartLoading.hide();
            });
    };
    onMounted(async () => {
        SmartLoading.show();
        clinic.value = await scheduleStore.getClinic(hid.value);
        SmartLoading.hide();
    });
</script>
<style lang="scss" scoped>
    .container {
        ::v-deep .consent.ant-input-disabled {
            border: none;
            background-color: transparent;
            color: #757575;
        }
        .head {
            margin: 0 auto;
            text-align: center;
            font-weight: 400;
            font-size: 16px;
        }
        .top {
            padding: 20px;
            color: #fff;
            text-align: center;
            .title {
                margin-bottom: 10px;
                font-size: 20px;
            }
            .info {
                color: #fff;
                line-height: 20px;
            }
        }
        .line {
            margin: 20px 0;
            width: 100%;
            height: 1px;
            background-color: #d9d9d9;
        }
        .tip {
            color: #757575;
        }
        .width-full {
            width: 100%;
        }
        #signature-pad {
            width: 100%;
            height: 200px;
        }
        .info {
            padding: 0 15px;
            color: #00796b;
        }
    }
</style>
