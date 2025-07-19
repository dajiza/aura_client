<template>
    <div class="container">
        <div class="nav">
            <ArrowLeftOutlined id="menu" @click="() => router.go(-1)" />
            <span class="head">{{ clinic?.detail?.name }}</span>
        </div>

        <div :class="['content', { mobile: isMobile }]">
            <div class="title">Select date and time</div>
            <div class="body">
                <div class="date-picker-container">
                    <vue-cal
                        class="date-picker"
                        date-picker
                        start-week-on-sunday
                        :disable-days="disableDays"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @cell-click="onDateSelect"
                        :selected-date="selectedDate"
                    />
                </div>
                <div v-if="selectedDate" class="time-slots-container">
                    <div class="time-categories">
                        <div v-for="(slots, category) in categorizedSlots" :key="category" class="time-category">
                            <div class="category-title">{{ category }}</div>
                            <div v-if="slots.length > 0" class="time-slots-grid">
                                <button
                                    v-for="slot in slots"
                                    :key="`${slot.start}-${slot.end}`"
                                    :class="['time-slot-btn', active === `${selectedDate}-${slot.start}` ? 'active' : '']"
                                    @click="selectTimeSlot(selectedDate, slot)"
                                >
                                    {{ formatTime(slot.start) }}
                                </button>
                            </div>
                            <div v-else class="no-slots">No available times in {{ category }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <a-button class="continue-btn" type="primary" :disabled="continueDisabled" size="large" @click="onContinue"> Continue </a-button>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { SmartLoading } from '@/components/smart-loading';
    import router from '@/routers/index';
    import { useUserStore } from '@/stores/modules/system/user';
    import { useScheduleStore } from '@/stores/modules/schedule';
    import { useRoute } from 'vue-router';
    import { VueCal } from 'vue-cal';
    import 'vue-cal/style';
    import moment from 'moment-timezone';

    const scheduleStore = useScheduleStore();
    const userStore = useUserStore();
    let { isMobile } = userStore;
    const route = useRoute();
    const hid = ref(route.query.hid);
    const email = ref(route.query.email);
    const service = ref(route.query.service);
    const staff = ref(route.query.staff);
    const clinic = ref();
    const active = ref('');
    const availableTimeSlots = ref([]);
    const selectedDate = ref('');
    const selectedSlot = ref('');
    const disableDays = ref([]);

    const minDate = ref();
    const maxDate = ref();

    const continueDisabled = computed(() => {
        if (!active.value) {
            return true;
        }
        return false;
    });

    // 当前选中日期的分类时间槽
    const categorizedSlots = computed(() => {
        if (!selectedDate.value) return {};
        const slots = getAvailableSlotsForDate(selectedDate.value);
        return categorizeTimeSlots(slots);
    });

    // 获取特定日期的可用时间槽
    const getAvailableSlotsForDate = (date) => {
        const dateStr = moment(date).format('YYYY-MM-DD');
        const dayData = availableTimeSlots.value.find((item) => item.date === dateStr);
        return dayData ? dayData.slots : [];
    };

    // 将时间槽按时间段分类
    const categorizeTimeSlots = (slots) => {
        const categories = {
            Morning: [],
            Afternoon: [],
            Evening: [],
        };

        slots.forEach((slot) => {
            const hour = parseInt(slot.start.split(':')[0]);
            const minute = parseInt(slot.start.split(':')[1]);
            const timeInMinutes = hour * 60 + minute;

            // 0:00-11:59AM (0-719分钟) 为 Morning
            // 12:00PM-6:59PM (720-1139分钟) 为 Afternoon
            // 7:00PM-11:59PM (1140-1439分钟) 为 Evening
            if (timeInMinutes >= 0 && timeInMinutes < 720) {
                categories.Morning.push(slot);
            } else if (timeInMinutes >= 720 && timeInMinutes < 1140) {
                categories.Afternoon.push(slot);
            } else if (timeInMinutes >= 1140 && timeInMinutes < 1440) {
                categories.Evening.push(slot);
            }
        });

        return categories;
    };

    // 日期选择处理
    const onDateSelect = ({ cursor }) => {
        selectedDate.value = moment(cursor.date).format('YYYY-MM-DD');
        active.value = ''; // 重置时间选择
    };

    // 时间槽选择处理
    const selectTimeSlot = (date, slot) => {
        active.value = `${date}-${slot.start}`;
        selectedSlot.value = slot;
    };

    const formatTime = (time) => {
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const minute = parseInt(m);
        const ampm = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:${minute.toString().padStart(2, '0')}${ampm}`;
    };

    // 自动选中第一个可用的时间槽
    const autoSelectFirstAvailableSlot = () => {
        if (!selectedDate.value) return;

        const slots = getAvailableSlotsForDate(selectedDate.value);
        if (slots.length > 0) {
            const firstSlot = slots[0];
            active.value = `${selectedDate.value}-${firstSlot.start}`;
            selectedSlot.value = firstSlot;
        }
    };

    // 自动选中第一个有可用时间槽的日期
    const autoSelectFirstAvailableDate = () => {
        const availableDays = availableTimeSlots.value.filter((day) => day.slots.length > 0);
        if (availableDays.length > 0) {
            const firstAvailableDay = availableDays[0];
            selectedDate.value = firstAvailableDay.date;
            autoSelectFirstAvailableSlot();
        }
    };

    const onContinue = async () => {
        router.push({
            path: '/schedule/confirm',
            query: {
                hid: hid.value,
                email: email.value,
                service: service.value,
                staff: staff.value,
                date: selectedDate.value,
                start: selectedSlot.value.start,
                end: selectedSlot.value.end,
            },
        });
    };

    const generationTimeList = async () => {
        let { schedule } = await scheduleStore.querySchedule({ hid: hid.value, staff: staff.value });
        let serviceData = clinic.value?.services.find((item) => item.id == service.value);
        let staffData = clinic.value?.staffs.find((item) => item.id == staff.value);

        let bookingTime, breakTimes, duration;
        bookingTime = staffData.booking_time || [];
        breakTimes = staffData.booking_breaks_enable ? staffData.booking_breaks_time : 0;
        duration = serviceData.duration;

        // 确保schedule是数组
        const existingSchedules = Array.isArray(schedule) ? schedule : [];

        // 生成今天到未来一个月内的每日可预约时间区块
        const generateAvailableTimeSlots = () => {
            const timeSlots = [];
            const today = moment().tz(clinic.value?.detail?.timezone);
            const endDate = moment().tz(clinic.value?.detail?.timezone).add(1, 'month');

            let currentDate = today.clone();
            while (currentDate.isBefore(endDate)) {
                const dayOfWeek = currentDate.format('dddd').toLowerCase();
                const dateStr = currentDate.format('YYYY-MM-DD');
                const dayConfig = bookingTime.find((item) => item.week === dayOfWeek);
                if (dayConfig && dayConfig.enable) {
                    const daySlots = [];
                    dayConfig.time.forEach((timeRange) => {
                        const [startTime, endTime] = timeRange;
                        const slots = generateTimeSlotsForRange(startTime, endTime, duration, breakTimes, dateStr, existingSchedules);
                        daySlots.push(...slots);
                    });
                    timeSlots.push({
                        date: dateStr,
                        dayOfWeek: dayOfWeek,
                        slots: daySlots,
                    });
                } else {
                    // 没有配置直接push空
                    timeSlots.push({
                        date: dateStr,
                        dayOfWeek: dayOfWeek,
                        slots: [],
                    });
                }
                currentDate.add(1, 'day');
            }
            return timeSlots;
        };

        // 为指定时间段生成时间槽
        const generateTimeSlotsForRange = (startTime, endTime, duration, breakTimes, dateStr, existingSchedules) => {
            const slots = [];
            const startMoment = moment(`${dateStr} ${startTime}`, 'YYYY-MM-DD HH:mm');
            const endMoment = moment(`${dateStr} ${endTime}`, 'YYYY-MM-DD HH:mm');
            const now = moment().tz(clinic.value?.detail?.timezone).valueOf();
            const isToday = moment(dateStr).clone().tz(clinic.value?.detail?.timezone, true).isSame(now, 'day');
            let currentSlot = startMoment.clone();

            while (currentSlot.add(duration, 'minutes').isBefore(endMoment)) {
                const slotStart = currentSlot.clone().subtract(duration, 'minutes');
                const slotEnd = currentSlot.clone();

                // 检查是否与已预约时间冲突
                const isConflict = existingSchedules.some((schedule) => {
                    const scheduleDate = moment(schedule.date, 'YYYYMMDD').format('YYYY-MM-DD');
                    const scheduleStart = moment(`${scheduleDate} ${schedule.start_time}`, 'YYYY-MM-DD HH:mm');
                    const scheduleEnd = moment(`${scheduleDate} ${schedule.end_time}`, 'YYYY-MM-DD HH:mm');

                    return scheduleDate === dateStr && slotStart.isBefore(scheduleEnd) && slotEnd.isAfter(scheduleStart);
                });

                const isPastTime = isToday && slotStart.clone().tz(clinic.value?.detail?.timezone, true).valueOf() < now;
                if (!isConflict && !isPastTime) {
                    slots.push({
                        start: slotStart.format('HH:mm'),
                        end: slotEnd.format('HH:mm'),
                        startMoment: slotStart.format(),
                        endMoment: slotEnd.format(),
                    });
                }

                // 添加间隔时间
                currentSlot.add(breakTimes, 'minutes');
            }

            return slots;
        };

        const timeSlots = generateAvailableTimeSlots();
        availableTimeSlots.value = timeSlots;

        // 新增：将没有可预约时间的日期加入disableDays
        disableDays.value = timeSlots.filter((day) => day.slots.length === 0).map((day) => day.date);
        return timeSlots;
    };

    onMounted(async () => {
        SmartLoading.show();
        clinic.value = await scheduleStore.getClinic(hid.value);
        await generationTimeList();
        minDate.value = moment().tz(clinic.value?.detail?.timezone).format('YYYY-MM-DD');
        maxDate.value = moment().tz(clinic.value?.detail?.timezone).add(1, 'month').format('YYYY-MM-DD');

        autoSelectFirstAvailableDate();

        SmartLoading.hide();
    });
</script>
<style lang="scss" scoped>
    @import '@/styles/vuecal.scss';
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        .date-picker :deep {
            max-width: 400px;
            height: auto;
            .vuecal__cell--disabled {
                background-color: rgba(29, 27, 32, 0.12);
                color: #79747e;
            }
            .vuecal__cell {
                margin: auto;
                width: 33px;
                height: 33px;
            }
            .vuecal__body {
                gap: 6px;
            }
        }
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
        margin-top: 30px;
        max-height: calc(100% - 100px);
        width: 100%;
        .box {
            margin-bottom: 20px;
        }
    }

    .date-picker-container {
        flex-shrink: 0;
        margin-bottom: 20px;
        padding-top: 20px;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
    }

    .time-categories {
        display: flex;
        flex-direction: column;

        gap: 24px;
    }
    .time-category {
        padding: 0;
        border: none;
        background: none;
        box-shadow: none;
    }
    .category-title {
        margin-bottom: 10px;
        font-weight: 600;
    }
    .time-slots-grid {
        display: flex;
        flex-wrap: wrap;

        gap: 16px;
    }
    .time-slot-btn {
        min-width: 90px;
        height: 30px;
        outline: none;
        border: 1px solid #009688;
        border-radius: 6px;
        background: #fff;
        color: #009688;
        cursor: pointer;
        transition: all 0.2s;
    }
    .time-slot-btn.active {
        border-color: #009688;
        background: #009688;
        color: #fff;
    }
    .time-slot-btn:active {
        opacity: 0.8;
    }
    .no-slots {
        padding: 16px 0;
        border-radius: 0;
        background: none;
        color: #bbb;
        text-align: center;
        font-style: italic;
    }
    .continue-btn {
        margin-top: auto;
        max-width: 400px;
        width: 80%;
    }
</style>
