<template>
    <WebNav></WebNav>
    <div class="container">
        <div class="content">
            <swiper class="swiper" :modules="modules" :pagination="{ clickable: true }">
                <swiper-slide v-for="(item, index) in detail.gallery" :key="index">
                    <img :src="item" alt="" style="width: 100%" />
                </swiper-slide>
                <div class="swiper-pagination"></div>
                <div class="back" @click="() => router.go(-1)">
                    <ArrowLeftOutlined style="margin-right: 10px" />
                    Back
                </div>
            </swiper>
            <div class="box">
                <div class="icons">
                    <ShareAltOutlined style="margin-right: 20px" @click="copy" />
                    <div class="rate">
                        <div>{{ (detail.rate / detail.rate_amount).toFixed(1) }}</div>
                        <StarFilled style="color: #00796b; margin: 0 10px" />
                        <div>({{ detail.rate_amount }})</div>
                        <div class="view" @click="() => router.push({ path: '/web/rate-list', query: { hid } })">view all</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 30px">
                    <div style="width: 330px">
                        <div class="name">{{ detail.name }}</div>
                        <div class="info">{{ detail.address }}</div>
                        <div class="info">{{ detail.phone }}</div>
                        <div class="info">{{ detail.email }}</div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap">
                        <div class="tag" v-for="item in detail.discipline" :key="item">
                            <CheckOutlined style="margin-right: 10px" />
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px">
                    <div class="summary">
                        <div class="summary-title"><InfoCircleOutlined class="icon" />About us</div>
                        <div class="detail">{{ detail.about }}</div>
                    </div>
                    <div class="summary">
                        <div class="summary-title"><SmileOutlined class="icon" />Services</div>
                        <ul class="detail">
                            <li class="li" v-for="item in services">
                                {{ item.name }}<span style="margin-left: 6px" v-if="detail.service_price_show">(${{ item.price.toFixed(2) }})</span>
                            </li>
                        </ul>
                    </div>
                    <div class="summary">
                        <div class="summary-title"><ShoppingCartOutlined class="icon" />Products</div>
                        <ul class="detail">
                            <li class="li" v-for="item in products">
                                {{ item.name }}<span style="margin-left: 6px" v-if="detail.product_price_show">(${{ item.price.toFixed(2) }})</span>
                            </li>
                        </ul>
                    </div>
                    <div class="summary" v-if="detail.booking_enable">
                        <div class="summary-title"><CalendarOutlined class="icon" />Online appointment</div>
                        <a-button type="primary" style="margin-top: 20px" @click="book">Book now</a-button>
                    </div>
                </div>
                <div class="summary">
                    <div class="summary-title"><UserOutlined class="icon" />Our team</div>
                    <div class="staff" v-for="item in staffs">
                        <img class="avatar" :src="item.avatar" alt="" />
                        <div>
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px">{{ item.first_name }} {{ item.last_name }}</div>
                            <div style="color: #757575; font-size: 12px">{{ item.introduction }}</div>
                        </div>
                    </div>
                </div>
                <div class="summary">
                    <div class="summary-title">
                        <img src="/src/assets/img/reviews.svg" alt="" class="icon" style="width: 16px" /> Reviews ({{ detail.rate_amount }})
                    </div>
                    <div class="comment" v-for="item in rates">
                        <a-rate :value="item.rate" disabled>
                            <template #character>
                                <StarFilled style="font-size: 14px" />
                            </template>
                        </a-rate>
                        <div style="margin-top: 4px">{{ item.feedback || 'This is a rating-only review' }}</div>
                        <div class="user">
                            <img class="user-avatar" :src="item.avatar" alt="" v-if="item.avatar" />
                            <div class="user-avatar" v-if="!item.avatar">
                                {{ item.first_name.slice(0, 1) }}
                            </div>
                            <div style="margin-left: 10px">
                                <div>{{ item.first_name.slice(0, 3) }}***</div>
                                <div style="color: #b3b3b3; margin-top: 4px">{{ moment(detail?.create_at).format('MMM D, YYYY') }}</div>
                            </div>
                        </div>
                        <WarningFilled class="report" @click="report(item)" />
                    </div>
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
    import { useUserStore } from '@/stores/modules/system/user';
    import { supabase, authClient } from '@/utils/supabase';
    import { useRoute } from 'vue-router';
    import router from '@/routers/index';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Pagination } from 'swiper/modules';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import useClipboard from 'vue-clipboard3';
    import { message, Modal } from 'ant-design-vue';
    import moment from 'moment-timezone';
    import WebNav from './web-nav.vue';

    let modules = [Pagination];

    const uid = ref(useUserStore().getUid);
    const route = useRoute();

    const { toClipboard } = useClipboard();
    let hid = ref(route.query.hid);
    let detail = ref({});
    let services = ref([]);
    let products = ref([]);
    let staffs = ref([]);
    let rates = ref([]);

    const book = () => {
        // console.log('🚀 ~ book ~ detail.value.book:', detail.value.booking);
        // window.open(detail.value.book);
        window.location.href = detail.value.booking;
    };
    const copy = async () => {
        try {
            await toClipboard(window.location.href);
            // await toClipboard(detail.value.website);
            message.success('Copy successfully');
        } catch (e) {}
    };

    const getData = async () => {
        SmartLoading.show();
        let { data, error } = await supabase.from('hospitals').select('*').eq('hid', hid.value);
        let { data: servicesData } = await supabase.from('service').select().eq('hid', data[0].hid).eq('show', true);
        let { data: productsData } = await supabase.from('product').select().eq('hid', data[0].hid).eq('show', true);
        let { data: staffData } = await supabase.from('users').select().eq('hid', data[0].hid).eq('display', true);
        let { data: ratesData, count } = await supabase.from('rates').select().eq('hid', data[0].hid);

        detail.value = data[0];
        services.value = servicesData;
        products.value = productsData;
        staffs.value = staffData;
        rates.value = ratesData;

        SmartLoading.hide();
    };
    const report = async (item) => {
        Modal.confirm({
            title: 'Confirm to report review',
            content: '',
            cancelText: 'Cancel',
            okText: 'Confirm',
            async onOk() {
                let { data } = await supabase.from('rates').select().eq('id', item.id);
                await supabase
                    .from('rates')
                    .update({ report_amount: data[0].report_amount + 1 })
                    .eq('id', item.id);
                message.success('Report successfully');
            },
        });
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
    .content {
        padding: 0;
    }
    .swiper {
        position: relative;
        height: 175px;
        .back {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1;
            display: flex;
            align-items: center;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
        }
    }
    .box {
        padding: 20px;
        .tag {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            padding: 0 10px;
            height: 32px;
            border-radius: 8px;
            background-color: #f5f5dc;
            color: #00796b;
            font-size: 12px;
        }
        .icons {
            display: flex;
            align-items: center;
            font-size: 16px;
        }
        .name {
            margin-bottom: 10px;
            font-size: 22px;
        }
        .info {
            margin-bottom: 4px;
            color: #757575;
            font-size: 18px;
        }
        .rate {
            display: flex;
            .view {
                margin-left: 15px;
                color: #00796b;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        .summary {
            margin-top: 30px;
            .summary-title {
                display: flex;
                align-items: center;
                font-size: 18px;
                .icon {
                    margin-right: 15px;
                }
            }
            .detail {
                margin-top: 10px;
                margin-left: 32px;
                color: #757575;
                .li {
                    list-style-type: disc;
                    line-height: 18px;
                }
            }
            .staff {
                display: flex;
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #d9d9d9;
                border-radius: 8px;
                .avatar {
                    margin-right: 10px;
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                }
            }
            .comment {
                position: relative;
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #d9d9d9;
                border-radius: 8px;
                color: #1e1e1e;
                font-size: 12px;
                .report {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: #757575;
                    font-size: 20px;
                    cursor: pointer;
                }
                .a-rate {
                    margin-bottom: 10px;
                }
                .user {
                    display: flex;
                    align-items: center;
                    margin-top: 20px;
                    .user-avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 40px;
                        height: 40px;
                        border-radius: 40px;
                        background-color: #d9d9d9;
                        font-size: 20px;
                    }
                }
            }
        }
    }
</style>
