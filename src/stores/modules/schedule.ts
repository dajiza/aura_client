import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import router from '@/routers/index';

export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        hid: ref(''),
        clinic: ref(null),
        patient: ref(null),
        email: ref(''),
        service: ref(''),
        staff: ref(''),
        schedule: ref(null),
    }),
    getters: {
        // getHid: (state) => state.hid,
        // getEmail: (state) => state.email || 'chensa22@gmail.com',
        // getService: (state) => state.service || '',
        // getStaff: (state) => state.staff || '',
        // getClinic: async (state) => {
        //     return state.clinic;
        // },
    },
    actions: {
        // setHid(value: string) {
        //     this.hid = value;
        // },
        // setPatient(value: any) {
        //     this.patient = value;
        // },
        // setService(value: string) {
        //     this.service = value;
        // },
        // setStaff(value: string) {
        //     this.staff = value;
        // },
        async queryClinicDetail(hid: string) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/clinic-schedule-detail`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { hid: hid },
            });
            let res = response.data.res;
            res.servicesForBooking = res.services.filter((item) => item.booking_enable);
            res.staffsForBooking = res.staffs.filter((item) => item.booking_enable);
            console.log('🚀 ~ queryClinicDetail ~ res:', res);
            this.clinic = res;
        },
        async getClinic(hid: string) {
            if (!hid) {
                router.push('/');
            }
            if (!this.clinic) {
                await this.queryClinicDetail(hid);
            }
            return this.clinic;
        },
        async queryPatient({ hid, email, pid }: { hid: string; email: string; pid: string }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/patient-get`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { hid, email, pid },
            });
            return response.data.res;
        },
        async getPatient({ hid, email }: { hid: string; email: string }) {
            if (!this.patient) {
                await this.queryPatient({ hid, email });
            }
            return this.patient;
        },

        async querySchedule({ hid, staff }: { hid: string; staff: string }) {
            if (this.schedule) {
                return this.schedule;
            }
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/schedule-find`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { hid: hid, staff_id: staff },
            });
            this.schedule = response.data.res;
            return this.schedule;
        },
        async createSchedule({
            hid,
            email,
            service,
            staff,
            date,
            start,
            end,
            need_email_reminder,
        }: {
            hid: string;
            email: string;
            service: string;
            staff: string;
            date: string;
            start: string;
            end: string;
            need_email_reminder: boolean;
        }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/schedule-create`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { hid, email, service, staff, date, start, end, need_email_reminder },
            });
            console.log('🚀 ~ response:', response);
            return response.data;
        },
        async queryScheduleDetail({ sid }: { sid: string }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/schedule-get`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { sid },
            });
            return response.data.res;
        },
        async cancelSchedule({ sid }: { sid: string }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/schedule-remove`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { sid },
            });
            return response.data.res;
        },
        async queryIntake({ pid }: { pid: string }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/intake-get`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { pid },
            });
            return response.data.res;
        },
        async queryHospital({ hid }: { hid: string }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/clinic-get`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { hid },
            });
            return response.data.res;
        },
        async upload({ fileName, file }: { fileName: string; file: File }) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/upload-base64`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: { fileName, file },
            });
            return response.data.res;
        },
        async createIntake(form: any) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/intake-create`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: form,
            });
            return response.data.res;
        },
        async createPatient(form: any) {
            let response = await axios({
                url: `${import.meta.env.VITE_APP_API_URL}/api/patient-create`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                data: form,
            });
            return response.data;
        },
    },
});
