<template>
    <div class="container">
        <div class="top">
            <div class="title">{{ hospital.name }} <CloseOutlined class="close-icon" @click="() => router.push('/')" /></div>
            <div class="info">{{ hospital.address }}</div>
            <div class="info">{{ hospital.email }}</div>
            <div class="info">{{ hospital.phone }}</div>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div>Hi, {{ patient.first_name }}, please fill out your intake form</div>
            <div class="line"></div>
            <a-form class="form" ref="formRef" :model="formState" :rules="rules" layout="vertical">
                <template v-if="fields.includes('Personal information')">
                    <a-form-item label="Email" name="email">
                        <a-input v-model:value="formState.email" disabled />
                    </a-form-item>
                    <a-form-item label="First name" name="first_name">
                        <a-input v-model:value="formState.first_name" />
                    </a-form-item>
                    <a-form-item label="Last name" name="last_name">
                        <a-input v-model:value="formState.last_name" />
                    </a-form-item>
                    <a-form-item label="Middle name">
                        <a-input v-model:value="formState.middle_name" />
                    </a-form-item>
                    <a-form-item label="Date of birth">
                        <a-date-picker
                            class="width-full"
                            v-model:value="formState.birth"
                            format="MM/DD/YYYY"
                            value-format="YYYYMMDD"
                            placeholder="MM/DD/YYYY"
                        />
                    </a-form-item>
                    <a-form-item label="Sex">
                        <a-radio-group v-model:value="formState.gender">
                            <a-radio value="0">Male</a-radio>
                            <a-radio value="1">Female</a-radio>
                            <a-radio value="2">Prefer not to say</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="MSP No.">
                        <a-input v-model:value="formState.msp_no" />
                    </a-form-item>
                    <a-form-item label="Phone" name="phone">
                        <a-input-group style="display: flex" compact>
                            <a-select v-model:value="formState.phone_prefix">
                                <a-select-option value="+1">+1</a-select-option>
                            </a-select>
                            <a-input v-model:value="formState.phone" />
                        </a-input-group>
                    </a-form-item>

                    <a-form-item label="Address">
                        <a-input v-model:value="formState.address" />
                    </a-form-item>
                </template>
                <template v-if="fields.includes('Emergency contacts')">
                    <a-form-item label="Emergency contact person">
                        <div class="tip">Please enter first and last name</div>
                        <a-input v-model:value="formState.emergency_name" />
                    </a-form-item>
                    <a-form-item label="Emergency contact information" class="width-480">
                        <div class="tip">Please enter phone or email</div>

                        <a-input v-model:value="formState.emergency_information" />
                    </a-form-item>
                </template>
                <template v-if="fields.includes('Chief complaint')">
                    <a-form-item class="width-480" label="Chief complaint">
                        <div class="tip">Please describe your concern</div>
                        <a-textarea v-model:value="formState.primary_concern" placeholder="" :rows="4" />
                    </a-form-item>
                </template>
                <template v-if="fields.includes('Medical history')">
                    <a-form-item class="width-480" label="Medical history">
                        <div class="tip">Please list any injuries/ surgeries/ diagnosed conditions you had. Enter n/a if doesn’t apply</div>
                        <a-textarea v-model:value="formState.medical_history" placeholder="" :rows="4" />
                    </a-form-item>
                </template>
                <template v-if="fields.includes('Allergy')">
                    <a-form-item class="width-480" label="Allergy">
                        <div class="tip">Enter n/a if doesn’t apply</div>
                        <a-textarea v-model:value="formState.allergy" placeholder="" :rows="4" />
                    </a-form-item>
                </template>
                <template v-if="fields.includes('Consent and signature')">
                    <a-form-item class="width-850" label="Consent">
                        <a-textarea class="consent" v-model:value="consent" disabled :auto-size="true" />
                        <a-checkbox v-model:checked="checked" style="margin-top: 20px">I agree to the above terms</a-checkbox>
                        <div style="margin-top: 40px">Digital signature</div>
                        <div
                            style="
                                margin-top: 10px;
                                margin-bottom: 10px;
                                color: #757575;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            Please type or sign your full name
                        </div>
                        <canvas id="signature-pad" class="signature-pad"></canvas>
                        <div style="text-align: right; width: 100%; margin-top: -32px; padding-right: 15px">
                            <a-button type="primary" size="small" @click="clearSign">Clear</a-button>
                        </div>
                    </a-form-item>
                </template>
                <p class="info">
                    By submitting this form, you agree to share your personal and health information with Aura Cure. Your data is used only to prepare
                    for your visit and provide care. It is stored securely and handled in compliance with PIPEDA, HIPAA, and GDPR. Your information
                    may be processed using secure tools based in the U.S., with safeguards in place. You can request to access, correct, or delete
                    your data at any time.
                </p>
                <p class="info">
                    See our <a style="text-decoration: underline" href="https://www.aura-cure.com/privacy.html" target="_blank">Privacy Policy</a> or
                    contact us at privacy@aura-cure.com.
                </p>
                <a-form-item class="btns" :wrapper-col="{ span: 24, offset: 0 }">
                    <a-button
                        style="width: 100%"
                        type="primary"
                        size="large"
                        @click="onSubmit"
                        :disabled="!checked && fields.includes('Consent and signature')"
                    >
                        Submit
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
    import { supabase, authClient } from '@/utils/supabase';
    import SignaturePad from 'signature_pad';
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

    let formState = ref({
        first_name: '',
        last_name: '',
        middle_name: '',
        birth: '',
        gender: '',
        msp_no: '',
        phone_prefix: '+1',
        phone: '',
        email: '',
        address: '',
        emergency_name: '',
        emergency_information: '',
        primary_concern: '',
        medical_history: '',
        allergy: '',
        consent: '',
        hid: '',
        pid: '',
    });
    const rules = {
        first_name: [
            { required: true, message: 'Please input name', trigger: 'change' },
            { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
        ],
        last_name: [
            { required: true, message: 'Please input name', trigger: 'change' },
            { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
        ],
    };

    const getData = async () => {
        SmartLoading.show();
        let { detail: patientData } = await scheduleStore.queryPatient({ pid: pid.value });
        if (!patientData) {
            // router.push({ path: '/schedule/intake-fail', query: { hid: hid.value } });
            return;
        }
        patient.value = patientData;

        let { detail: hospitalData } = await scheduleStore.queryHospital({ hid: hid.value });
        if (!hospitalData) {
            router.push({ path: '/schedule/intake-fail', query: { hid: hid.value } });
            return;
        }

        let { detail: intakeData } = await scheduleStore.queryIntake({ pid: pid.value });
        if (intakeData) {
            message.warning('You have already filled out your intake form.');
            // router.push({ path: '/schedule/intake-success', query: { hid: hid.value } });
            return;
        }

        fields.value = hospitalData.intake_fields || [];
        consent.value = hospitalData.intake_consent || '';
        hospital.value = hospitalData;

        formState.value = {
            first_name: patient.value.first_name,
            last_name: patient.value.last_name,
            middle_name: patient.value.middle_name,
            birth: patient.value.birth ? moment(patient.value.birth, 'YYYYMMDD').format('MM/DD/YYYY') : '',
            gender: patient.value.gender,
            msp_no: patient.value.msp_no,
            phone_prefix: patient.value.phone_prefix,
            phone: patient.value.phone,
            email: patient.value.email,
            address: patient.value.address,
            emergency_name: patient.value.emergency_name,
            emergency_information: '',
            primary_concern: '',
            medical_history: patient.value.diagnosed,
            allergy: patient.value.allergy,
            consent: '',
            hid: patient.value.hid,
            pid: pid.value,
        };
        SmartLoading.hide();
    };
    const clearSign = () => {
        signaturePad.value.clear();
    };
    const uploadSign = async () => {
        // const sign = signaturePad.value.toDataURL();
        // let fileName = moment().valueOf().toString() + _.random(1000000, 9999999) + '.png';
        // const file = base64ToFile(sign, fileName);
        // const { data } = await supabase.storage.from('image').upload(fileName, file, {
        //     cacheControl: '3600',
        //     upsert: false,
        // });
        // return import.meta.env.VITE_APP_SUPABASE_STORAGE_URL + data.fullPath;
        const sign = signaturePad.value.toDataURL();
        let fileName = moment().valueOf().toString() + _.random(1000000, 9999999) + '.png';
        // const file = base64ToFile(sign, fileName);
        // console.log('🚀 ~ uploadSign ~ file:', file);
        const res = await scheduleStore.upload({ fileName, file: sign });
        return import.meta.env.VITE_APP_SUPABASE_STORAGE_URL + res.data.fullPath;
    };

    const base64ToFile = (base64Data, filename) => {
        // 将base64的数据部分提取出来
        const parts = base64Data.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        // 将原始数据转换为Uint8Array
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        // 使用Blob和提取出的数据内容创建一个新的Blob对象
        const blob = new Blob([uInt8Array], { type: contentType });
        // 创建一个File对象
        const file = new File([blob], filename, { type: contentType });
        return file;
    };
    const onSubmit = async () => {
        SmartLoading.show();
        formRef.value
            .validate()
            .then(async () => {
                let form = _.cloneDeep(formState.value);
                form.birth = moment(form.birth, 'MM/DD/YYYY').format('YYYYMMDD');
                if (fields.value.includes('Consent and signature')) {
                    if (signaturePad.value.isEmpty()) {
                        message.warning('Please sign your full name');
                        SmartLoading.hide();
                        return;
                    } else {
                        form.name_sign = await uploadSign();
                    }
                }
                form.pid = pid.value;
                let { error } = await scheduleStore.createIntake(form);

                if (error) {
                    if (error.code == '23505') {
                        message.error('You have already filled out your intake form.');
                    } else if (error.code == '42501') {
                        message.error('This is not your email');
                    } else {
                        message.error(error.message);
                    }
                    SmartLoading.hide();
                    return;
                }
                message.success('Intake form saved!');
                SmartLoading.hide();
                router.push({ path: '/schedule/intake-success', query: { hid: hid.value } });
            })
            .catch((error) => {
                console.log('🚀 ~ onSubmit ~ error:', error);
                message.warning('Please complete the data');
                SmartLoading.hide();
            });
    };
    onMounted(async () => {
        await getData();
        let canvas = document.getElementById('signature-pad');

        // 获取Canvas元素的实际宽度和高度
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        // 将Canvas的实际宽度和高度设置为获取到的值
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        signaturePad.value = new SignaturePad(canvas, {
            backgroundColor: '#eee', // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
        });
    });
</script>
<style lang="scss" scoped>
    .container {
        ::v-deep .consent.ant-input-disabled {
            border: none;
            background-color: transparent;
            color: #757575;
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
            margin: 30px 0;
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
