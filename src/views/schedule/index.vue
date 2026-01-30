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
                        <img class="avatar" :src="item.avatar || defaultAvatar" alt="avatar" />
                        <div class="info">
                            <div class="name">{{ item.first_name }} {{ item.last_name }}</div>
                            <div class="title">{{ item.title }}</div>
                            <div class="introduction">{{ item.introduction }}</div>
                            <div class="next">
                                <div class="next-title">Next Available</div>
                                <div class="next-time">{{ item.earliest_available_time_format }}</div>
                            </div>
                            <div class="book" @click="() => router.push({ path: '/schedule/visited', query: { hid, staff: item.id } })">
                                Book Appointment
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-subtitle" style="margin: 40px 0">Book by service</div>
                <div class="service-list">
                    <div class="service-item" v-for="item in clinic?.servicesForBooking" :key="item.id">
                        <div class="service-title">
                            <div class="service-name">{{ item.name }}</div>
                            <div class="service-description">{{ item.description_before }}</div>
                        </div>
                        <div class="service-info">
                            <div class="service-time">{{ item.duration }} min</div>
                            <div class="service-price">${{ item.price }}</div>
                        </div>
                        <div class="service-book" @click="() => router.push({ path: '/schedule/visited', query: { hid, service: item.id } })">
                            Book Now
                        </div>
                    </div>
                </div>
            </div>
            <div class="clinic">
                <div class="detail-title">Clinic Information</div>
                <div class="clinic-info">
                    <div class="info-title">Location</div>
                    <div class="info-detail">{{ clinic?.detail?.address }}</div>
                    <div class="info-title">Contact</div>
                    <div class="info-title black">Phone</div>
                    <div class="info-detail">{{ clinic?.detail?.phone }}</div>
                    <div class="info-title black">Email</div>
                    <div class="info-detail" style="margin-bottom: 0">{{ clinic?.detail?.email }}</div>
                </div>
            </div>
            <!-- <a-button
                style="width: 80%; max-width: 400px; margin-top: auto"
                type="primary"
                size="large"
                @click="() => router.push({ path: '/schedule/visited', query: { hid } })"
                v-if="clinic?.detail?.booking_enable"
            >
                Continue to booking
            </a-button> -->
        </div>
        <div class="footer">
            <div class="name">{{ clinic?.detail?.name }}</div>
            <div class="powered">Powered by Aura Cure</div>
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
    import defaultAvatar from '@/assets/img/avatar.png';

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
    .mobile {
        .service-list {
            .service-item {
                display: block;
                padding: 20px 20px;
                .service-info {
                    text-align: left;
                    margin-top: 30px;
                }
                .service-book {
                    margin-top: 30px;
                    margin-left: 0;
                }
            }
        }
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        margin-top: 0;
        border-radius: 0;
        background-color: #f8f9fa;
        overflow: visible;
        padding: 40px;
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
        padding: 0 20px;
        text-align: center;
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
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 300px));
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
    .service-list {
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
        // padding: 30px;
        .service-item {
            width: 100%;
            display: flex;
            border-bottom: 1px solid #e1eee6;
            padding: 30px 40px;
            flex-wrap: wrap;
            &:last-child {
                border-bottom: none;
            }
            .service-title {
                flex: 1;
                .service-name {
                    color: #006d60;
                    font-weight: 700;
                    font-size: 20px;
                    margin-bottom: 15px;
                }
                .service-description {
                    color: #666;
                    white-space: pre-wrap;
                    line-height: 1.5;
                }
            }
            .service-info {
                text-align: center;
                .service-time {
                    color: #333;
                    font-weight: 700;
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .service-price {
                    color: #006d60;
                    font-weight: 700;
                    font-size: 22px;
                }
            }
            .service-book {
                width: 120px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                align-self: center;
                border-radius: 8px;
                background: #8bc34a;
                color: #fff;
                font-weight: 700;
                font-size: 15px;
                cursor: pointer;
                margin-left: 60px;
                flex-shrink: 0;
            }
        }
    }
    .clinic {
        width: 100%;
        background: linear-gradient(131.65deg, #e1eee6 0%, #ffffff 100%);
        padding: 30px 40px;
        margin-top: 40px;
        border-radius: 12px;
        .detail-title {
            color: #006d60;
            font-weight: 700;
            font-size: 28px;
            border-bottom: 3px solid rgba(225, 238, 230, 1);
            padding-bottom: 20px;
        }
        .clinic-info {
            margin-top: 20px;
            border-radius: 10px;
            padding: 30px 20px;
            background: #fff;
            .info-title {
                color: #006d60;
                font-weight: 700;
                font-size: 16px;
                margin-bottom: 20px;
                &.black {
                    color: #555;
                }
            }
            .info-detail {
                color: #666;
                margin-bottom: 20px;
            }
        }
    }
    .footer {
        background-color: #006d60;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px 20px;
        color: #fff;
        text-align: center;
        .name {
            font-size: 24px;
            font-weight: 700;
            line-height: 1.5;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            margin-bottom: 30px;
            padding: 0 100px 30px;
        }
        .powered {
            font-size: 14px;
        }
    }
</style>
