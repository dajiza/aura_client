import { defineStore } from 'pinia';

export const useSpinStore = defineStore({
    id: 'spin',
    state: () => ({
        loading: false,
    }),

    actions: {
        hide() {
            this.loading = false;
            let spins = document.querySelector<HTMLElement>('.ant-spin-nested-loading');
            if (spins) {
                spins.style.zIndex = '999';
            }
        },
        show() {
            this.loading = true;
            let spins = document.querySelector<HTMLElement>('.ant-spin-nested-loading');
            if (spins) {
                spins.style.zIndex = '1001';
            }
        },
    },
});
