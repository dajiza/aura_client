/*
 * loading 组件
 *
 * @Author:    Aura Cure
 * @Date:      2022-07-22 20:33:41
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  Aura Cure （ https://1024lab.net ），Since 2012
 */
import { useSpinStore } from '@/stores/modules/system/spin';

export const SmartLoading = {
    show: () => {
        useSpinStore().show();
    },

    hide: () => {
        useSpinStore().hide();
    },
};
