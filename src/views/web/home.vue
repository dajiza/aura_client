<template>
    <WebNav></WebNav>
    <div class="container">
        <div class="content">
            <div class="topic">Daily Dose of TCM</div>
            <div class="item" v-for="blog in list">
                <div class="img" v-if="blog.type === 'image' && blog.image.length > 0"><img :src="blog.image[0] || ''" alt="TCM" /></div>
                <div style="margin-left: 20px">
                    <div class="blog-title">{{ blog.title }}</div>
                    <div class="blog-subtitle">{{ blog.subtitle }}</div>
                    <a-button class="read" size="large" type="link" @click="() => router.push({ path: '/blog', query: { id: blog.id } })">
                        Read more
                    </a-button>
                </div>
            </div>
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
    import WebNav from './web-nav.vue';

    let list = ref([]);

    const openLogin = () => {
        loginDrawer.value.openModal();
    };
    const getData = async () => {
        SmartLoading.show();
        let response = await axios({
            // url: `http://localhost:3000/api/portal-email`,
            url: `${import.meta.env.VITE_APP_API_URL}/api/blog`,
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
        });
        list.value = response.data.res;
        console.log('🚀 ~ getData ~ list.value:', list.value);
        SmartLoading.hide();
    };
    onMounted(async () => {
        getData();
    });
</script>
<style lang="scss" scoped>
    .topic {
        margin-bottom: 30px;
        color: #00796b;
        font-weight: bold;
        font-size: 26px;
    }
    .item {
        display: flex;
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        .img {
            overflow: hidden;
            width: 160px;
            height: 160px;
            img {
                width: 100%;
            }
        }
        .blog-title {
            margin-top: 20px;
            color: #00796b;
            font-weight: 500;
            font-size: 24px;
        }
        .blog-subtitle {
            margin-top: 10px;
            color: #757575;
            font-size: 18px;
        }
        .read {
            margin-top: 20px;
            background-color: #e1eee6;
            color: #00796b;
        }
    }
</style>
