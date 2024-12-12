<template>
    <a-modal
        wrap-class-name="note-modal-wrap"
        cancel-text="Discard note"
        ok-text="Save note"
        :closable="false"
        :mask-closable="true"
        width="100%"
        v-model:open="open"
        title=""
        :keyboard="false"
        :destroy-on-close="false"
        :footer="null"
        :force-render="true"
        getContainer="#app"
    >
        <div class="container">
            <div class="content">
                <div style="margin-bottom: 20px; color: #00796b; font-weight: bold; font-size: 16px">How was your experience?</div>
                <div style="margin-bottom: 20px; font-size: 24px">Leave a rating</div>
                <a-rate v-model:value="rate">
                    <template #character>
                        <StarFilled style="font-size: 40px" />
                    </template>
                </a-rate>
                <div style="margin-top: 50px; font-size: 16px">Share your feedback</div>
                <a-textarea v-model:value="feedback" placeholder="feedback" :rows="6" style="width: 100%; margin-top: 10px" />
                <a-button type="primary" size="large" style="width: 100%; margin-top: 40px" @click="submit">Submit</a-button>
                <a-button type="link" size="large" style="width: 100%; margin-top: 20px" @click="close">Close</a-button>
            </div>
            <LoginDrawer ref="loginDrawer"></LoginDrawer>
        </div>
    </a-modal>
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
    const route = useRoute();
    import { message } from 'ant-design-vue';

    const uid = ref(useUserStore().getUid);
    const email = ref(useUserStore().getEmail);
    const userInfo = ref(useUserStore().getUserInfo);

    let id = ref('');
    let rate = ref(0);
    let feedback = ref('');
    let clinic = ref([]);
    let discipline = ref([]);
    let disciplineActive = ref([]);
    let notes = ref([]);
    let detail = ref({});
    let hospital = ref({});
    let sort = ref('reviews');
    let open = ref(false);
    const emit = defineEmits(['change']);

    const openModal = async (value) => {
        console.log('🚀 ~ openModal ~ value:', value);
        id.value = value;
        getData();
        open.value = true;
    };
    const close = () => {
        open.value = false;
    };
    const onTag = (tag) => {
        if (!disciplineActive.value.includes(tag)) {
            disciplineActive.value.push(tag);
        } else {
            disciplineActive.value.splice(disciplineActive.value.indexOf(tag), 1);
        }
    };

    const getData = async () => {
        SmartLoading.show();
        let { data: noteData } = await supabase.from('notes').select('*').eq('id', id.value);
        let { data: hospitalsData } = await supabase.from('hospitals').select('*').eq('hid', noteData[0].hid);
        detail.value = noteData[0];
        console.log('🚀 ~ getData ~ detail:', detail);
        hospital.value = hospitalsData[0];
        SmartLoading.hide();
    };

    const submit = async () => {
        if (rate.value === 0) {
            message.warning('Please leave a rating.');
            return;
        }
        SmartLoading.show();
        let { data: noteData } = await supabase.from('notes').select('*').eq('id', id.value);
        let { data: hospitalsData } = await supabase.from('hospitals').select('*').eq('hid', noteData[0].hid);
        if (noteData[0].is_rate) {
            SmartLoading.hide();
            message.warning('You have already rated.');
            return;
        }
        let { data: patientsData } = await supabase.from('patients').select('*').eq('email', email.value);
        await supabase.from('rates').insert({
            hid: noteData[0].hid,
            notes_id: noteData[0].id,
            pid: noteData[0].pid,
            rate: rate.value,
            feedback: feedback.value,
            avatar: userInfo.value.avatar,
            first_name: patientsData[0].first_name,
            last_name: patientsData[0].last_name,
            phone: patientsData[0].phone,
            email: patientsData[0].email,
        });
        await supabase.from('notes').update({ is_rate: true }).eq('id', id.value);
        await supabase
            .from('hospitals')
            .update({ rate_amount: hospitalsData[0].rate_amount + 1, rate: hospitalsData[0].rate + rate.value })
            .eq('hid', noteData[0].hid);
        SmartLoading.hide();
        message.success('Thank you for your feedback.');
        emit('change');
        close();
    };
    defineExpose({
        openModal,
    });
</script>
<style lang="scss" scoped>
    .content {
        margin: 0;
        min-height: 100%;
        width: 100%;
        border-radius: 0;
    }
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
