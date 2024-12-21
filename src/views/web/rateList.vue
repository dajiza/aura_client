<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="goBack" />
            <span class="title">{{ detail.name }}</span>
        </div>
        <div class="content">
            <div class="box">
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
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import { useUserStore } from '@/stores/modules/system/user';
    import { supabase, authClient } from '@/utils/supabase';
    import { useRoute } from 'vue-router';
    import router from '@/routers/index';
    import moment from 'moment-timezone';
    import { message, Modal } from 'ant-design-vue';

    const uid = ref(useUserStore().getUid);
    const route = useRoute();

    let hid = ref(route.query.hid);
    let detail = ref({});
    let rates = ref([]);

    const goBack = () => {
        router.go(-1);
    };

    const getData = async () => {
        SmartLoading.show();
        let { data } = await supabase.from('hospitals').select('*').eq('hid', hid.value);
        let { data: ratesData, count } = await supabase.from('rates').select().eq('hid', data[0].hid);

        detail.value = data[0];
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
        height: 175px;
    }
    .box {
        padding: 20px;
        .icons {
            font-size: 20px;
        }
        .name {
            margin-top: 30px;
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
            margin-top: 30px;
            .view {
                margin-left: 15px;
                color: #00796b;
                text-decoration: underline;
            }
        }
        .summary {
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
