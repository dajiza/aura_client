<template>
    <div class="pdf" id="pdf" v-if="formState?.pid">
        <a-form class="form" ref="formRef" layout="inline">
            <div class="title">Intake form for {{ patient.first_name }} {{ patient.last_name }}</div>
            <div style="margin-top: 8px">
                <div class="hospital">{{ hospital.name }}</div>
                <div class="hospital">{{ hospital.address }}</div>
                <div class="hospital">{{ hospital.phone }}</div>
                <div class="hospital">{{ hospital.email }}</div>
                <div class="hospital">{{ hospital.website }}</div>
            </div>
            <template v-if="fields.includes('Personal information')">
                <div class="line"></div>
                <a-form-item label="First name" name="first_name">
                    {{ formState.first_name }}
                </a-form-item>
                <a-form-item label="Last name" name="last_name">
                    {{ formState.last_name }}
                </a-form-item>
                <a-form-item label="Middle name">
                    {{ formState.middle_name }}
                </a-form-item>
                <a-form-item label="Date of birth">
                    {{ formState.birth ? moment(formState.birth, 'YYYYMMDD').format('MMM DD, YYYY') : '' }}
                </a-form-item>
                <a-form-item label="Gender">
                    <span v-if="formState.gender === '0'">Male</span>
                    <span v-if="formState.gender === '1'">Female</span>
                    <span v-if="formState.gender === '2'">Prefer not to say</span>
                </a-form-item>
                <a-form-item label="Phone" name="phone"> {{ formState.phone_prefix }} {{ formState.phone }} </a-form-item>
                <a-form-item label="MSP No.">
                    {{ formState.msp_no }}
                </a-form-item>
                <a-form-item label="Email" name="email">
                    {{ formState.email }}
                </a-form-item>
                <a-form-item label="Address">
                    {{ formState.address }}
                </a-form-item>
            </template>
            <template v-if="fields.includes('Emergency contacts')">
                <div class="line"></div>
                <a-form-item label="Emergency contact person">
                    {{ formState.emergency_name }}
                </a-form-item>
                <a-form-item label="Emergency contact information" class="width-full">
                    {{ formState.emergency_information }}
                </a-form-item>
            </template>
            <template v-if="fields.includes('Chief complaint')">
                <div class="line"></div>
                <a-form-item class="width-full" label="Primary concern">
                    {{ formState.primary_concern }}
                </a-form-item>
            </template>
            <template v-if="fields.includes('Medical history')">
                <div class="line"></div>
                <a-form-item class="width-full" label="Medical history">
                    {{ formState.medical_history }}
                </a-form-item>
            </template>
            <template v-if="fields.includes('Allergy')">
                <div class="line"></div>
                <a-form-item class="width-full" label="Allergy">
                    {{ formState.allergy }}
                </a-form-item>
            </template>
            <template v-if="fields.includes('Consent and signature')">
                <div class="line"></div>
                <template v-if="consents?.length">
                    <div class="width-full" v-for="record in consents" :key="record.id">
                        <div class="consent-name">{{ record.template_name }}</div>
                        <div class="consent-body">{{ record.body }}</div>
                    </div>
                </template>
                <a-form-item class="width-full" label="Consent" v-else>
                    {{ consent }}
                </a-form-item>
                <a-form-item class="width-full" label="Signature" style="margin-top: 20px">
                    <img :src="signatureImage" alt="" style="width: 250px" v-if="signatureImage" />
                    <div v-else>{{ signatureName }}</div>
                </a-form-item>
            </template>
        </a-form>
        <!-- <div class="foot">Powered by Aura Cure Inc.</div> -->
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import moment from 'moment-timezone';

    const props = defineProps({
        fields: {
            type: Object,
            default: {},
        },
        formState: {
            type: Object,
            default: {},
        },
        patient: {
            type: Object,
            default: {},
        },
        hospital: {
            type: Object,
            default: {},
        },
        consent: {
            type: String,
            default: '',
        },
        consents: {
            type: Array,
            default: () => [],
        },
    });

    const signatureImage = computed(() => props.consents?.[0]?.name_sign || props.formState?.name_sign);
    const signatureName = computed(() => props.consents?.[0]?.name_type || props.formState?.name_type);
</script>

<style lang="scss" scoped>
    .pdf {
        position: absolute;
        top: 0;
        right: 10000px;
        margin: 0 auto;
        padding: 0 20px;
        width: 860px;
        // height: 1215px;
        background-color: #fff;
        .hospital {
            display: block;
            font-weight: bold;
        }
        .foot {
            position: absolute;
            right: 0;
            bottom: 30px;
            left: 0;
            color: #757575;
            text-align: center;
            font-size: 12px;
        }
        .title {
            // margin-bottom: 20px;
            width: 100%;
            color: #00796b;
            font-weight: bold;
            font-size: 30px;
        }
        .consent-name {
            margin-top: 12px;
            font-weight: 500;
            font-size: 16px;
        }
        .consent-body {
            margin-top: 8px;
            margin-bottom: 16px;
            white-space: pre-wrap;
            line-height: 1.7;
        }
        .line {
            margin: 20px 0;
            width: 100%;
            height: 1px;
            border-top: 1px solid #ddd;
        }
        .form {
            display: flex;
            flex-wrap: wrap;
            .ant-form-item {
                flex-shrink: 0;
                margin-right: 10px;
                min-width: 200px;
            }
            .width-full {
                min-width: 100%;
            }
        }
    }
</style>
