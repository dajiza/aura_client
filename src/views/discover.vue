<template>
    <div class="container">
        <div class="nav">
            <MenuOutlined id="menu" @click="openLogin" />
            <span class="title">Aura Cure</span>
        </div>
        <div :class="['content', { mobile: isMobile }]">
            <Bulb></Bulb>
            <div style="color: #00796b; font-size: 18px; font-weight: bold">Find clinic</div>
            <div class="clinic">
                <div :class="['item', disciplineActive.includes(item) ? 'active' : '']" v-for="item in discipline" @click="onTag(item)">
                    {{ item }}
                </div>
                <div class="reset" @click="disciplineActive = []"><SyncOutlined style="margin-right: 10px" />Reset filter</div>
            </div>
            <div class="line"></div>
            <div class="filter">
                <SwapOutlined style="transform: rotate(90deg); font-size: 20px; margin-right: 10px" />
                <a-select ref="select" v-model:value="sort" style="width: 130px" @change="onSort">
                    <a-select-option value="reviews">Most reviews</a-select-option>
                    <a-select-option value="popular">Most popular</a-select-option>
                </a-select>
            </div>
            <div class="list">
                <div class="card" v-for="item in clinicFilter" :key="item.id" @click="gotoClinic(item)">
                    <div class="logo">
                        <img :src="item.logo || logo" alt="" />
                    </div>
                    <div class="info">
                        <div>{{ item.name }}</div>
                        <div class="rate">
                            <div>{{ item.rate ? (item.rate / item.rate_amount).toFixed(1) : 0 }}</div>
                            <StarFilled style="color: #00796b; margin: 0 5px" />
                            <div>({{ item.rate_amount || 0 }})</div>
                        </div>
                        <div class="address">{{ item.address }}</div>
                    </div>
                    <div class="banner">
                        <img class="full-img" :src="item?.gallery ? item?.gallery[0] : gallery" alt="" />
                    </div>
                </div>
            </div>
        </div>
        <LoginDrawer ref="loginDrawer"></LoginDrawer>
    </div>
</template>
<script setup>
    import LoginDrawer from '@/components/LoginDrawer.vue';
    import Bulb from '@/components/Bulb.vue';
    const loginDrawer = ref();
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import logo from '@/assets/img/logo3.jpeg';
    import gallery from '@/assets/img/gallery.png';
    import { useUserStore } from '@/stores/modules/system/user';
    const userStore = useUserStore();
    let { isMobile } = userStore;

    let clinic = ref([]);
    let discipline = ref([]);
    let disciplineActive = ref([]);
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
        let response = await axios({
            url: `${import.meta.env.VITE_APP_API_URL}/api/clinic`,
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
        });
        clinic.value = response.data.res
            .map((e) => {
                e.rating = e.rate ? e.rate / e.rate_amount : 0;
                return e;
            })
            .sort((a, b) => b.rate_amount - a.rate_amount);
        clinic.value.forEach((item) => {
            item.discipline.forEach((disciplineItem) => {
                if (!discipline.value.includes(disciplineItem)) {
                    discipline.value.push(disciplineItem);
                }
            });
        });
        SmartLoading.hide();
    };
    const gotoClinic = (item) => {
        router.push({ path: '/clinic', query: { hid: item.hid } });
    };
    const onSort = (e) => {
        if (e === 'popular') {
            clinic.value = clinic.value.sort((a, b) => b.rating - a.rating);
        } else {
            clinic.value = clinic.value.sort((a, b) => b.rate_amount - a.rate_amount);
        }
    };
    onMounted(async () => {
        getData();
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
        justify-content: center;
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 0 10px;
        height: 32px;
        border: 1px solid #cac4d0;
        border-radius: 8px;
        &.active {
            border: none;
            background-color: #e1eee6;
            color: #00796b;
        }
    }
    .reset {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 32px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.05);
    }
    .line {
        margin: 40px 0;
        width: 100%;
        height: 1px;
        background-color: #d9d9d9;
    }
    .list {
        margin-top: 30px;
        .card {
            display: flex;
            overflow: hidden;
            align-items: center;
            margin-bottom: 20px;
            width: 100%;
            height: 80px;
            border-radius: 12px;
            background-color: #e1eee6;
            .logo {
                overflow: hidden;
                margin-left: 20px;
                width: 40px;
                height: 40px;
                border-radius: 40px;
            }
            .info {
                margin-left: 15px;
                .rate {
                    display: flex;
                    margin: 6px 0;
                    font-size: 10px;
                }
                .address {
                    font-size: 12px;
                }
            }
            .banner {
                flex-shrink: 0;
                margin-left: auto;
                width: 80px;
                height: 80px;
            }
        }
    }
</style>
