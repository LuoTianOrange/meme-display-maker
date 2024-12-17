import { createRouter, createWebHistory } from 'vue-router'
// import { routes } from 'vue-router/auto-routes'
import theme1 from '@/pages/theme/theme1.vue'
import theme2 from '@/pages/theme/theme2.vue'

const routes = [
    {
        path: '/',
        name: 'theme',
        component: () => import('@/pages/theme/index.vue'),
        children: [
            {
                path: '', // 默认子路由路径为空
                redirect: 'theme2' // 重定向到默认子路由
            },
            {
                path: 'theme1',
                name: 'theme1',
                component: theme1
            },
            {
                path: 'theme2',
                name: 'theme2',
                component: theme2
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
