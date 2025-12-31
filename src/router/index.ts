import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/ai',
      name: 'ai',
      component: () => import('../components/AIChat.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginForm.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogListView.vue')
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('../components/BlogPostDetail.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryListView.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../views/ToolsView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // 初始化认证状态
  if (localStorage.getItem('token') && !authStore.user) {
    await authStore.fetchCurrentUser()
  }
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要认证，检查是否已登录
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页，并记录当前路由作为跳转目标
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 已登录，允许访问
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // 需要访客状态，检查是否已登录
    if (authStore.isAuthenticated) {
      // 已登录，重定向到首页
      next({ path: '/' })
    } else {
      // 未登录，允许访问
      next()
    }
  } else {
    // 普通路由，允许访问
    next()
  }
})

export default router
