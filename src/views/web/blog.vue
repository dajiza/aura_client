<template>
    <div class="container">
        <div class="nav">
            <MenuOutlined id="menu" @click="openLogin" />
            <span class="title">Aura Cure</span>
        </div>
        <div
            style="display: flex; align-items: center; color: #fff; margin-left: 30px; font-size: 20px; margin-bottom: 20px"
            @click="() => router.go(-1)"
        >
            <ArrowLeftOutlined style="margin-right: 10px" />
            Back to home
        </div>
        <div class="content">
            <div class="img" v-if="blog.type == 'image'">
                <img alt="" v-for="item in blog.image" :src="item" />
            </div>
            <div class="img" v-if="blog.type == 'video'">
                <video controls :src="blog.video[0]"></video>
            </div>
            <div class="topic">{{ blog.title }}</div>
            <div class="subtitle">{{ blog.subtitle }}</div>
            <div style="line-height: 18px; word-break: break-all" v-html="blog.content"></div>
        </div>
        <LoginDrawer ref="loginDrawer"></LoginDrawer>
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

    const route = useRoute();
    let id = ref(route.query.id);
    let blog = ref({});

    const openLogin = () => {
        loginDrawer.value.openModal();
    };
    const getData = async () => {
        SmartLoading.show();
        let response = await axios({
            url: `${import.meta.env.VITE_APP_API_URL}/api/blog-detail`,
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            params: { id: id.value },
        });
        blog.value = response.data.res;
        SmartLoading.hide();
    };
    onMounted(async () => {
        getData();
    });
</script>
<style lang="scss" scoped>
    .topic {
        margin-top: 20px;
        margin-bottom: 20px;
        color: #00796b;
        font-weight: bold;
        font-size: 22px;
    }
    .subtitle {
        margin-bottom: 20px;
        color: #757575;
        font-size: 14px;
    }
    .img {
        width: 100%;
        img {
            margin-bottom: 10px;
            width: 100%;
        }
    }
</style>
