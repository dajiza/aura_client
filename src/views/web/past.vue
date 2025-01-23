<template>
    <WebNav></WebNav>
    <div class="container">
        <div class="content">
            <div style="margin-bottom: 30px; font-size: 26px">Past visits</div>
            <div class="item" v-for="item in notes" :key="item.id" @click="() => router.push({ path: '/web/note', query: { id: item.id } })">
                <img class="logo" :src="item.hospital?.logo" alt="" />
                <div style="margin-left: 10px">
                    <div style="margin-bottom: 4px; font-weight: bold">{{ item.hospital?.name }}</div>
                    <div>{{ moment(item.created_at).format('MMM D, YYYY') }}</div>
                </div>
                <div style="margin-left: auto">
                    <div class="tag" v-if="item.instructions.patientInstruction || item.instructions.notes">
                        <img class="chat" src="/src/assets/img/chat-w.svg" alt="" />
                        Message from clinic
                    </div>
                </div>
                <a-button type="primary" ghost style="margin-left: 10px">View</a-button>
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
    import WebNav from './web-nav.vue';

    const uid = ref(useUserStore().getUid);
    const email = ref(useUserStore().getEmail);
    let notes = ref([]);

    const getData = async () => {
        SmartLoading.show();
        let { data: patientsData } = await supabase.from('patients').select('*').eq('email', email.value);
        if (patientsData.length > 0) {
            let pids = patientsData.map((e) => e.pid);
            let { data: notesData } = await supabase.from('notes').select('*').in('pid', pids).order('date', { ascending: false });
            let hids = _.uniq(notesData.map((item) => item.hid));
            let { data: hospitalsData } = await supabase.from('hospitals').select('*').in('hid', hids);
            let hospitalsDict = {};
            hospitalsData.forEach((item) => {
                hospitalsDict[item.hid] = item;
            });
            notes.value = notesData.map((item) => {
                return {
                    ...item,
                    hospital: hospitalsDict[item.hid],
                };
            });
        }

        SmartLoading.hide();
    };
    onMounted(async () => {
        if (!uid.value) {
            authClient.redirectToLoginPage({
                postLoginRedirectUrl: window.location.href || import.meta.env.CLIENT_APP_URL,
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
        color: #00796b;
        .logo {
            width: 40px;
            height: 40px;
            border-radius: 40px;
        }
        .tag {
            display: flex;
            align-items: center;
            padding: 0 10px;
            height: 32px;
            border-radius: 8px;
            background-color: #00796b;
            color: #fff;
            font-size: 12px;
            .chat {
                margin: 10px;
            }
        }
    }
</style>
