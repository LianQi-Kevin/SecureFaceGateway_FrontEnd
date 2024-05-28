import {createRouter, createWebHistory} from "vue-router";
import routes from "@/router/routes.js";
import {getUserInfo} from "@/network/user.js";
import type {userInfo} from "@/types/user";

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// 为metaData附加type
declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiresAdmin?: boolean;
        title?: string;
    }
}


// 根据meta.title修改页面标题
// router.afterEach 全局后置守卫, 导航结束后执行
router.afterEach((to) => {
    // 如果routes的meta中定义了title，则修改页面title
    if (to.meta['title']) {
        document.title = <string>to.meta['title'];
    }
});

router.beforeEach(async (to, _from, next) => {
    if (to.meta['requiresAuth']) {
        // 如果需要登录
        const token = localStorage.getItem('access_token');
        if (!token) {
            // 未登录
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_info");

            ElMessage({
                message: `${to.meta["title"] || to.path}需登陆后使用，请登陆账户`,
                type: 'error',
                duration: 1000,
                showClose: true,
            });
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            });
        } else {
            // 已登录
            if (to.meta['requiresAdmin']) {
                // 需要管理员权限
                // 校验是否为管理员权限
                const user_info: userInfo = await getUserInfo();
                if (user_info.role !== 'admin') {
                    ElMessage(
                        {
                            message: `${to.meta["title"] || to.path}仅限管理员用户访问，请登陆管理员账户`,
                            type: 'error',
                            duration: 1000,
                            showClose: true,
                        }
                    );
                    next({
                        path: _from.path,
                    });
                }
            }
        }
    }
    next();
})

export default router