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
        <div :class="['content', { mobile: isMobile }]">
            <div class="topic">{{ blog.title }}</div>
            <div class="subtitle">{{ blog.subtitle }}</div>
            <swiper class="img" :modules="modules" :pagination="{ clickable: true }" v-if="blog.type == 'image'">
                <swiper-slide v-for="(item, index) in blog.image" :key="index">
                    <img :src="item" alt="" style="width: 100%" />
                </swiper-slide>
                <div class="swiper-pagination"></div>
            </swiper>
            <div class="img" v-if="blog.type == 'video'">
                <video controls :src="blog.video[0]"></video>
            </div>

            <div style="line-height: 20px; font-size: 16px" v-html="blog.content"></div>
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
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Pagination } from 'swiper/modules';
    import 'swiper/css';
    import 'swiper/css/pagination';
    let modules = [Pagination];
    import { useUserStore } from '@/stores/modules/system/user';
    const userStore = useUserStore();
    let { isMobile } = userStore;

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
        font-size: 24px;
    }
    .subtitle {
        margin-bottom: 20px;
        color: #757575;
        font-size: 18px;
    }
    .img {
        width: 100%;
        img {
            margin-bottom: 10px;
            width: 100%;
        }
    }
</style>
