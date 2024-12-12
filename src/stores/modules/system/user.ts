/*
 * 登录用户
 *
 * @Author:    Aura Cure
 * @Date:      2022-09-06 20:55:09
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  Aura Cure （ https://1024lab.net ），Since 2012
 */
import _ from 'lodash';
import { defineStore } from 'pinia';
import { getTokenFromCookie } from '@/utils/cookie-util';
import { localClear, localRead, localSave } from '@/utils/local-util';

export const useUserStore = defineStore({
    id: 'userStore',
    state: () => ({
        uid: '',
        avatar: '',
        email: '',
        first_name: '',
        last_name: '',
        role: '',
        hid: '',
        h_name: '',
        timezone: '',
        is_subscription: false,

        token: '',
        //员工id
        employeeId: '',
        //登录名
        loginName: '',
        //姓名
        actualName: '',
        //手机号
        phone: '',
        //部门id
        departmentId: '',
        //部门名词
        departmentName: '',
        //是否为超级管理员
        administratorFlag: true,
        //上次登录ip
        lastLoginIp: '',
        //上次登录 设备
        lastLoginUserAgent: '',
        //上次登录时间
        lastLoginTime: '',
        //左侧菜单树形结构
        menuTree: [],
        //存在页面路由的菜单集合
        menuRouterList: [],
        //是否完成menuRouter初始化
        menuRouterInitFlag: false,
        //父类菜单集合
        menuParentIdListMap: new Map(),
        // 功能点集合
        pointsList: [],
        // 标签页
        tagNav: [],
        // 缓存
        keepAliveIncludes: [],
    }),
    getters: {
        getToken(state) {
            if (state.token) {
                return state.token;
            }
            return getTokenFromCookie();
        },
        getUserInfo(state) {
            return {
                uid: state.uid,
                avatar: state.avatar,
                email: state.email,
                first_name: state.first_name,
                last_name: state.last_name,
                role: state.role,
                hid: state.hid,
                h_name: state.h_name,
                timezone: state.timezone,
                is_subscription: state.is_subscription,
            };
        },
        getUid(state) {
            return state.uid;
        },
        getHid(state) {
            return state.hid;
        },
        getRole(state) {
            return state.role;
        },
        getEmail(state) {
            return state.email;
        },
        getTimezone(state) {
            return state.timezone || 'America/Los_Angeles';
        },

        //是否初始化了 路由
        getMenuRouterInitFlag(state) {
            return state.menuRouterInitFlag;
        },
        //菜单树
        getMenuTree(state) {
            return state.menuTree;
        },
        //菜单的路由
        getMenuRouterList(state) {
            return state.menuRouterList;
        },
        //菜单的父级id
        getMenuParentIdListMap(state) {
            return state.menuParentIdListMap;
        },
    },

    actions: {
        logout() {
            this.token = '';
            this.menuList = [];
            this.tagNav = [];
            this.userInfo = {};
            localClear();
        },
        //设置登录信息
        setUserLoginInfo(data) {
            this.uid = data.uid;
            this.avatar = data.avatar;
            this.email = data.email;
            this.first_name = data.first_name;
            this.last_name = data.last_name;
            this.role = data.role;
            this.hid = data.hid;
            this.h_name = data.h_name;
            this.timezone = data.timezone;
            this.loginName = data.email;
            this.actualName = `${data.first_name} ${data.last_name}`;

            // 用户基本信息
            this.token = data.token;
            this.employeeId = data.employeeId;
            this.phone = data.phone;
            this.departmentId = data.departmentId;
            this.departmentName = data.departmentName;
            this.administratorFlag = data.administratorFlag;
            this.lastLoginIp = data.lastLoginIp;
            this.lastLoginUserAgent = data.lastLoginUserAgent;
            this.lastLoginTime = data.lastLoginTime;

            // //菜单权限
            // this.menuTree = buildMenuTree(data.menuList);

            // //拥有路由的菜单
            // this.menuRouterList = data.menuList.filter((e) => e.path || e.frameUrl);

            // //父级菜单集合
            // this.menuParentIdListMap = buildMenuParentIdListMap(this.menuTree);

            // //功能点
            // this.pointsList = data.menuList.filter((menu) => menu.menuType === MENU_TYPE_ENUM.POINTS.value && menu.visibleFlag && !menu.disabledFlag);
        },
        setHospitalInfo(data) {
            this.hid = data.hid;
            this.h_name = data.h_name;
            this.is_subscription = data.is_subscription;
        },
        setToken(token) {
            this.token = token;
        },

        // 加入缓存
        pushKeepAliveIncludes(val) {
            if (!val) {
                return;
            }
            if (!this.keepAliveIncludes) {
                this.keepAliveIncludes = [];
            }
            if (this.keepAliveIncludes.length < 30) {
                let number = this.keepAliveIncludes.findIndex((e) => e === val);
                if (number === -1) {
                    this.keepAliveIncludes.push(val);
                }
            }
        },
        // 删除缓存
        deleteKeepAliveIncludes(val) {
            if (!this.keepAliveIncludes || !val) {
                return;
            }
            let number = this.keepAliveIncludes.findIndex((e) => e === val);
            if (number !== -1) {
                this.keepAliveIncludes.splice(number, 1);
            }
        },
        // 清空缓存
        clearKeepAliveIncludes(val) {
            if (!val || !this.keepAliveIncludes?.includes(val)) {
                this.keepAliveIncludes = [];
                return;
            }
            this.keepAliveIncludes = [val];
        },
    },
});

/**
 * 构建菜单父级集合
 */
function buildMenuParentIdListMap(menuTree) {
    let menuParentIdListMap = new Map();
    recursiveBuildMenuParentIdListMap(menuTree, [], menuParentIdListMap);
    return menuParentIdListMap;
}

function recursiveBuildMenuParentIdListMap(menuList, parentMenuList, menuParentIdListMap) {
    for (const e of menuList) {
        // 顶级parentMenuList清空
        if (e.parentId == 0) {
            parentMenuList = [];
        }
        let menuIdStr = e.menuId.toString();
        let cloneParentMenuList = _.cloneDeep(parentMenuList);
        if (!_.isEmpty(e.children) && e.menuName) {
            // 递归
            cloneParentMenuList.push({ name: menuIdStr, title: e.menuName });
            recursiveBuildMenuParentIdListMap(e.children, cloneParentMenuList, menuParentIdListMap);
        } else {
            menuParentIdListMap.set(menuIdStr, cloneParentMenuList);
        }
    }
}
