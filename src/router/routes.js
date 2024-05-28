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
        },
        props: true
    },
    {
        path: '/applications',
        name: 'ApplicationCenter',
        component: () => import('@/views/Application.vue'),
        meta: {
            requiresAuth: true,
            requiresAdmin: false,
            title: '应用中心'
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
            requiresAdmin: true,
            title: '后台管理系统'
        },
        children: [
            {
                path: 'user',
                name: 'UserControl',
                component: () => import('@/views/controller/UserControl.vue'),
                meta: {
                    requiresAuth: true,
                    requiresAdmin: true,
                    title: '用户管理'
                }
            },
            {
                path: 'approval',
                name: 'ApprovalCenter',
                component: () => import('@/views/controller/ApprovalCenter.vue'),
                meta: {
                    requiresAuth: true,
                    requiresAdmin: true,
                    title: '审批管理'
                }
            },
        ]
    },
    // {
    //     // 配置全局匹配，跳转到 Home
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/'
    // }
];

export default routes