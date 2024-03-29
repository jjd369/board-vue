import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/views/layout.vue'
import { hasToken } from '@/utils/token'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    children: [
      {
        path: '/signUp',
        name: 'signUp',
        component: () => import('@/components/signUp.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/components/login.vue'),
      },
      {
        path: '/boardList',
        name: 'boardList',
        component: () => import('@/components/boardList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/board/:id',
        name: 'board',
        component: () => import('@/components/board.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/write',
        name: 'write',
        component: () => import('@/components/writeBoard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/myPage',
        name: 'myPage',
        component: () => import('@/components/myPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
// eslint-disable-next-line
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 이 라우트는 인증이 필요하며 로그인 한 경우 확인하십시오.
    // 그렇지 않은 경우 로그인 페이지로 리디렉션하십시오.
    if (!hasToken()) {
      Message({
        showClose: true,
        type: 'info',
        message: '로그인이 필요합니다.',
      })
      return next({ name: 'login' })
    }
    next()
  } else {
    next() // 반드시 next()를 호출하십시오!
  }
})
export default router
