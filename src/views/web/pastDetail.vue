<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="title">{{ hospital.name }}</span>
        </div>
        <div class="content">
            <div style="margin-bottom: 30px; color: #00796b; font-weight: bold; font-size: 16px">Visit detail</div>
            <div class="row">
                <ClockCircleOutlined />
                Date: {{ moment(detail?.date).format('MMM D, YYYY') }}
            </div>
            <div class="row">
                <TagOutlined />
                Service: {{ detail?.service?.name }}
            </div>
            <div class="row">
                <UserOutlined />
                Practitioner: {{ detail?.practitioner?.first_name }} {{ detail?.practitioner?.last_name }}
            </div>
            <div class="line"></div>
            <div style="margin-bottom: 30px; color: #00796b; font-weight: bold; font-size: 16px">Message from practitioner:</div>
            <div class="row">{{ detail?.instructions?.patientInstruction }}</div>
            <div class="row">{{ detail?.instructions?.notes }}</div>
            <div class="row">{{ detail?.instructions?.init }}</div>

            <a-button type="primary" ghost size="large" style="width: 100%; margin-top: 40px" @click="openRate" v-if="!detail.is_rate">
                Leave a review
            </a-button>
            <a-button
                type="primary"
                size="large"
                style="width: 100%; margin-top: 20px"
                @click="() => router.push({ path: '/clinic', query: { hid: hospital.hid } })"
            >
                View clinic information
            </a-button>
        </div>
        <LoginDrawer ref="loginDrawer"></LoginDrawer>
        <RateModal ref="rateModalRef" @change="getData"></RateModal>
    </div>
</template>
<script setup>
    import LoginDrawer from '@/components/LoginDrawer.vue';
    const loginDrawer = ref();
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { supabase, authClient } from '@/utils/supabase';
    import { useUserStore } from '@/stores/modules/system/user';
    import moment from 'moment-timezone';
    import { useRoute } from 'vue-router';
    import RateModal from './rate.vue';

    const route = useRoute();

    const uid = ref(useUserStore().getUid);
    const email = ref(useUserStore().getEmail);
    let id = ref(route.query.id);

    let clinic = ref([]);
    let discipline = ref([]);
    let disciplineActive = ref([]);
    let notes = ref([]);
    let detail = ref({});
    let hospital = ref({});
    let sort = ref('reviews');
    const rateModalRef = ref();

    const getData = async () => {
        SmartLoading.show();
        let { data: noteData } = await supabase.from('notes').select('*').eq('id', id.value);
        let { data: hospitalsData } = await supabase.from('hospitals').select('*').eq('hid', noteData[0].hid);
        detail.value = noteData[0];
        hospital.value = hospitalsData[0];
        SmartLoading.hide();
        if (!noteData[0].is_rate) {
            openRate();
        }
    };
    const openRate = () => {
        console.log('🚀 ~ openRate ~ rateModalRef:', rateModalRef);
        rateModalRef.value.openModal(id.value);
    };
    onMounted(async () => {
        if (!uid.value) {
            authClient.redirectToLoginPage({
                postLoginRedirectUrl: import.meta.env.PROPELAUTH_REDIRECT_URL || 'http://localhost:8989/',
            });
        } else {
            getData();
        }
    });
</script>
<style lang="scss" scoped>
    .clinic {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    .row {
        margin-bottom: 10px;
        font-size: 16px;
    }
    .line {
        margin: 40px 0;
        width: 100%;
        height: 1px;
        background-color: #d9d9d9;
    }
</style>
