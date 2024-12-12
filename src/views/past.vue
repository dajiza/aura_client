<template>
    <div class="container">
        <div class="nav">
            <MenuOutlined id="menu" @click="openLogin" />
            <span class="title">Aura Cure</span>
        </div>
        <div class="content">
            <div style="margin-bottom: 30px">Past visits</div>
            <div class="item" v-for="item in notes" :key="item.id" @click="() => router.push({ path: '/note', query: { id: item.id } })">
                <img class="logo" :src="item.hospital.logo" alt="" />
                <div style="margin-left: 10px">
                    <div style="margin-bottom: 4px; font-weight: bold">{{ item.hospital.name }}</div>
                    <div>{{ moment(item.created_at).format('MMM D, YYYY') }}</div>
                </div>
                <div style="margin-left: auto">
                    <img
                        class="chat"
                        src="/src/assets/img/chat.svg"
                        alt=""
                        v-if="item.instructions.patientInstruction || item.instructions.notes || item.instructions.init"
                    />
                </div>
                <a-button type="primary" ghost style="margin-left: 10px">View</a-button>
            </div>
        </div>
        <LoginDrawer ref="loginDrawer"></LoginDrawer>
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

    const uid = ref(useUserStore().getUid);
    const email = ref(useUserStore().getEmail);
    let clinic = ref([]);
    let discipline = ref([]);
    let disciplineActive = ref([]);
    let notes = ref([]);
    let sort = ref('reviews');

    const openLogin = () => {
        loginDrawer.value.openModal();
    };
    const clinicFilter = computed(() => {
        if (disciplineActive.value.length === 0) {
            return clinic.value;
        }
        return clinic.value.filter((item) => {
            return item.discipline.some((disciplineItem) => {
                return disciplineActive.value.includes(disciplineItem);
            });
        });
    });

    const onTag = (tag) => {
        if (!disciplineActive.value.includes(tag)) {
            disciplineActive.value.push(tag);
        } else {
            disciplineActive.value.splice(disciplineActive.value.indexOf(tag), 1);
        }
    };

    const getData = async () => {
        SmartLoading.show();
        let { data: patientsData } = await supabase.from('patients').select('*').eq('email', email.value);
        if (patientsData.length > 0) {
            let { data: notesData } = await supabase.from('notes').select('*').eq('pid', patientsData[0].pid).order('date', { ascending: false });
            let hids = notesData.map((item) => item.hid);
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
    }
</style>
