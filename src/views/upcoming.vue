<template>
    <div class="container">
        <div class="nav">
            <MenuOutlined id="menu" @click="openLogin" />
            <span class="title">Aura Cure</span>
        </div>
        <div :class="['content', { mobile: isMobile }]">
            <div style="margin-bottom: 30px; font-size: 26px; display: flex; align-items: center">
                <span>Upcoming visits</span>
                <!-- <span style="margin-left: auto">
                    <a-button type="primary" @click="router.push({ path: '/web/schedule/index' })">Book New Appointment</a-button>
                </span> -->
            </div>
            <div class="item" v-for="item in list" :key="item.id">
                <img class="logo" :src="item.hospital?.logo" alt="" />
                <div style="margin-left: 10px">
                    <div>{{ item.hospital?.name }}</div>
                    <div style="margin: 10px 0">
                        {{ moment(item.start_time, 'HH:mm').format('hh:mm A') }} {{ moment(item.date).format('MMM D, YYYY') }}
                    </div>
                    <div>{{ item.service.name }} with {{ item.practitioner?.first_name }} {{ item.practitioner?.last_name }}</div>
                </div>
                <div style="margin-left: auto"></div>
                <a-button
                    type="primary"
                    ghost
                    style="margin-left: 10px"
                    @click="() => router.push({ path: '/web/schedule/reschedule', query: { sid: item.sid } })"
                >
                    View & Edit
                </a-button>
            </div>
        </div>
        <LoginDrawer ref="loginDrawer"></LoginDrawer>
    </div>
</template>
<script setup>
    import _ from 'lodash';
    import LoginDrawer from '@/components/LoginDrawer.vue';
    const loginDrawer = ref();
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { supabase, authClient } from '@/utils/supabase';
    import { useUserStore } from '@/stores/modules/system/user';
    import moment from 'moment-timezone';

    const uid = ref(useUserStore().getUid);
    const email = ref(useUserStore().getEmail);
    let list = ref([]);

    const openLogin = () => {
        loginDrawer.value.openModal();
    };
    const getData = async () => {
        SmartLoading.show();
        let { data: scheduleData } = await supabase
            .from('schedule')
            .select('*, hospital:hid ( * )')
            .eq('patient->>email', email.value)
            .order('start_at', { ascending: true });
        console.log('🚀 ~ getData ~ scheduleData:', scheduleData);

        list.value = scheduleData;

        SmartLoading.hide();
    };
    onMounted(async () => {
        if (!uid.value) {
            authClient.redirectToLoginPage({
                postLoginRedirectUrl: window.location.href || import.meta.env.VITE_CLIENT_APP_URL,
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
    .item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #e1eee6;
        border-radius: 8px;
        .logo {
            width: 40px;
            height: 40px;
            border-radius: 40px;
        }
    }
</style>
