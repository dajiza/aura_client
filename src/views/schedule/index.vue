<template>
    <div class="container">
        <div class="top">
            <div class="h-name">{{ clinic?.detail?.name }}</div>
            <div class="h-about" v-html="clinic?.detail?.about"></div>
        </div>
        <div class="middle">
            <div style="font-size: 42px; font-weight: 700">Book Your Appointment Online</div>
            <div>Welcome to our convenient online booking system</div>
            <div>Schedule your visit with our experienced practitioners in just a few clicks</div>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="policy">
                <div class="policy-title" style="font-weight: bold">Booking Policy</div>
                <div class="policy-body" style="white-space: pre-wrap" v-html="clinic?.detail?.booking_policy"></div>
            </div>
            <div class="detail">
                <div class="detail-title">Choose Your Booking Method</div>
                <div class="detail-subtitle">Book by practitioner</div>
                <div class="list">
                    <div class="item" v-for="item in clinic?.staffsForBooking" :key="item.id">
                        <img class="avatar" :src="item.avatar" alt="avatar" />
                        <div class="info">
                            <div class="name">{{ item.first_name }} {{ item.last_name }}</div>
                            <div class="title">{{ item.title }}</div>
                            <div class="introduction">{{ item.introduction }}</div>
                            <div class="next">
                                <div class="next-title">Next Available</div>
                                <div class="next-time">Feb 12 2:00 PM</div>
                            </div>
                            <div class="book">Book Appointment</div>
                        </div>
                    </div>
                </div>
            </div>
            <a-button
                style="width: 80%; max-width: 400px; margin-top: auto"
                type="primary"
                size="large"
                @click="() => router.push({ path: '/schedule/visited', query: { hid } })"
                v-if="clinic?.detail?.booking_enable"
            >
                Continue to booking
            </a-button>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { useScheduleStore } from '@/stores/modules/schedule';
    import { useRoute } from 'vue-router';
    import { localSave } from '@/utils/local-util';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid);
    localSave('hid', hid.value);

    const clinic = ref();

    onMounted(async () => {
        SmartLoading.show();
        clinic.value = await scheduleStore.getClinic(hid.value);
        SmartLoading.hide();
    });
</script>
<style lang="scss" scoped>
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        margin-top: 0;
        border-radius: 0;
    }
    .head {
        margin: 0 auto;
        text-align: center;
        font-weight: 400;
        font-size: 16px;
    }
    .body {
        overflow-y: auto;
        flex-grow: 1;
        margin-top: 20px;
        max-height: calc(100% - 100px);
        width: 100%;
        text-align: center;
    }
    .top {
        background-color: #fff;
        padding: 20px 40px;
        .h-name {
            font-weight: 700;
            font-style: Bold;
            font-size: 24px;
            color: #006d60;
        }
        .h-about {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
            white-space: pre-wrap;
        }
    }
    .middle {
        background: linear-gradient(98.73deg, #006d60 0%, #008577 100%);
        min-height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        flex-direction: column;
        gap: 20px;
    }
    .policy {
        border-left: 4px solid #8bc34a;
        padding: 30px 20px;
        border-radius: 8px;
        background-color: #e1eee6;
        width: 100%;
        .policy-title {
            color: #006d60;
            font-weight: 700;
        }
        .policy-body {
            white-space: pre-wrap;
            margin-top: 10px;
            color: #00796b;
            line-height: 1.5;
        }
    }
    .detail {
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        width: 100%;
        margin-top: 40px;
        padding: 40px 30px;
        .detail-title {
            color: #006d60;
            font-weight: 700;
            font-size: 28px;
            border-bottom: 3px solid rgba(225, 238, 230, 1);
            padding-bottom: 20px;
        }
        .detail-subtitle {
            color: #006d60;
            font-weight: 700;
            font-size: 24px;
            margin-top: 20px;
        }
    }
    .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        margin-top: 20px;
        gap: 40px;
        justify-content: space-between;
        .item {
            width: 100%;
            // height: 710px;
            border-radius: 12px;
            background: rgba(248, 249, 250, 1);
            overflow: hidden;
            .avatar {
                width: 100%;
                height: 300px;
            }
            .info {
                padding: 20px;
                .name {
                    color: #006d60;
                    font-weight: 700;
                    font-size: 22px;
                }
                .title {
                    color: #8bc34a;
                    margin-top: 15px;
                }
                .introduction {
                    color: #666;
                    margin-top: 15px;
                    white-space: pre-wrap;
                    line-height: 1.5;
                }
                .next {
                    border-top: 1px solid #e1eee6;
                    margin-top: 5px;
                    padding-top: 15px;
                    .next-title {
                        color: #999;
                    }
                    .next-time {
                        color: #333;
                        font-weight: bold;
                        margin-top: 5px;
                    }
                }
                .book {
                    width: 100%;
                    height: 45px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 20px;
                    background: #8bc34a;
                    font-weight: 700;
                    font-size: 15px;
                    color: #fff;
                    margin-bottom: 20px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
