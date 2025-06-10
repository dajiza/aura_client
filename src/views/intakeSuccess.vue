<template>
    <div class="container">
        <div class="top">
            <div class="title">{{ hospital.name }}</div>
            <div class="info">{{ hospital.address }}</div>
            <div class="info">{{ hospital.email }}</div>
            <div class="info">{{ hospital.phone }}</div>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div style="color: #757575; font-size: 14px; margin-top: 40px">{{ patient.email }}</div>
            <div style="color: #00796b; font-size: 26px; margin-top: 40px">Thank you for completing your intake form</div>
            <img src="/src/assets/img/check.png" alt="" style="width: 48px; height: 48px; margin: 40px auto" />
            <!-- <a-button type="primary" style="margin-top: 100px; width: 100px" @click="close">Close</a-button> -->
        </div>
    </div>
</template>
<script setup>
    import LoginDrawer from '@/components/LoginDrawer.vue';
    const loginDrawer = ref();
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/modules/system/user';
    import { supabase } from '@/utils/supabase';

    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    let pid = ref(route.query.pid);
    let hospital = ref({});
    let patient = ref({});
    // const hid = ref(useUserStore().getHid);

    const close = () => {
        var win = window.open('', '_self', '');
        win.close();
    };
    const getData = async () => {
        SmartLoading.show();
        let { data: patientData } = await supabase.from('patients').select('*').eq('pid', pid.value);
        patient.value = patientData[0];
        if (patient.value?.hid) {
            let { data: hospitalData } = await supabase.from('hospitals').select('*').eq('hid', patient.value.hid);
            hospital.value = hospitalData[0];
        }
        SmartLoading.hide();
    };
    onMounted(async () => {
        await getData();
    });
</script>
<style lang="scss" scoped>
    .container {
        .top {
            padding: 20px;
            color: #fff;
            text-align: center;
            .title {
                margin-bottom: 10px;
                font-size: 20px;
            }
            .info {
                line-height: 20px;
            }
        }
        .content {
            text-align: center;
        }
    }
</style>
