<template>
    <div class="container">
        <div class="nav">
            <span class="title">{{ name }}</span>
        </div>
        <div :class="['content', { mobile: isMobile }]">
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
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import { supabase, authClient } from '@/utils/supabase';
    import { useRoute } from 'vue-router';
    const route = useRoute();
    import { message } from 'ant-design-vue';
    import axios from 'axios';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    const userStore = useUserStore();
    let { isMobile } = userStore;
    let id = ref(route.query.id);
    let name = ref(route.query.name);
    let rate = ref(0);
    let feedback = ref('');

    const submit = async () => {
        if (rate.value === 0) {
            message.warning('Please leave a rating.');
            return;
        }
        SmartLoading.show();
        await axios({
            url: `${import.meta.env.VITE_APP_API_URL}/api/create-rate`,
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            params: { id: id.value, rate: rate.value, feedback: feedback.value },
        })
            .then((response) => {
                SmartLoading.hide();
                message.success('Thank you for your feedback.');
                router.push({ path: '/rate-success' });
            })
            .catch((error) => {
                SmartLoading.hide();
                message.error(error.response.data.message);
            });
    };
    onMounted(async () => {});
</script>
<style lang="scss" scoped>
    .content {
        margin: 10px auto 0;
        min-height: 100%;
        border-radius: 0;
        border-radius: 12px;
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
