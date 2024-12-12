/*
 * cookie相关操作
 *
 * @Author:    Aura Cure
 * @Date:      2022-09-06 20:58:49
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  Aura Cure （ https://1024lab.net ），Since 2012
 */

export const COOKIE_TOKEN_KEY = 'user_token';

export const clearAllCoolies = (): void => {
    // Cookies.remove(COOKIE_TOKEN_KEY);
    localStorage.removeItem('token');
};

export const getTokenFromCookie = (): string | undefined => {
    // return Cookies.get(COOKIE_TOKEN_KEY);
    let token: any = localStorage.getItem('token');
    token = JSON.parse(token);
    return token;
};

/**
 * 7 一年后cookie过期
 *
 * @param token
 */
export const saveTokenToCookie = (token: string): void => {
    // Cookies.set(COOKIE_TOKEN_KEY, token, { expires: 365 });
    localStorage.setItem('token', JSON.stringify(token));
};
