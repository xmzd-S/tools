import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
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

export default router
