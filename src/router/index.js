import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import BagView from '@/views/BagView.vue'
import UserFormView from '@/views/FormViews/UserFormView.vue'
import LoginView from '@/views/FormViews/LoginView.vue'
import ProfileView from '@/views/FormViews/ProfileView.vue'
import { useAuthStore } from '../stores/auth';
import AromasView from '@/views/AromasView.vue'
import OrderView from '@/views/OrderView.vue'
import SeeOrderView from '@/views/SeeOrderView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/produto/:id',
    name: 'produto',
    component: ProductView
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/sacola',
    name: 'sacola',
    component: BagView,
    meta: { requiresAuth: true },
  },
  {
    path: '/userForm',
    name: 'user',
    component: UserFormView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/aromas',
    name:'aromas',
    component: AromasView
  },
  {
    path: '/fazer-pedido',
    name: 'fazer-pedido',
    component: OrderView,
    meta: { requiresAuth: true },
  },
  {
    path: '/pedido/:id',
    name: 'pedido',
    component: SeeOrderView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    if (savedPosition) {
      return savedPosition
    }

    return { top: 25 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
