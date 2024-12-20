/*
 * localStorage 相关操作
 *
 * @Author:    Aura Cure
 * @Date:      2022-09-06 20:58:49
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  Aura Cure （ https://1024lab.net ），Since 2012
 */

export const localSave = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

export const localRead = (key: string): string | null => {
    return localStorage.getItem(key) || '';
};

export const localClear = (): void => {
    localStorage.clear();
};
