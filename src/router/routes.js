import Home from "@/views/Home.vue";

const routes = [
    {
        path: '/',
        alias: '/home',
        name: 'Home',
        component: Home,    // 首页不启用lazyLoad
        meta: {
            requiresAuth: false,    // 是否需要鉴权 ( 非必要, 默认false )
            title: 'Home'   // 页面标题 ( 非必要 )
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {
            requiresAuth: false,
            title: '登录'
        }
    },
    {
        path: '/detect',
        name: 'Detect',
        component: () => import('@/views/Detect.vue'),
        meta: {
            requiresAuth: false,
            title: '人脸识别'
        }
    },
    {
        path: '/controller',
        name: 'Controller',
        component: () => import('@/views/Controller.vue'),
        meta: {
            requiresAuth: true,
            title: '后台管理系统'
        }
    },
    {
        // 配置全局匹配，跳转到 Home
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

export default routes