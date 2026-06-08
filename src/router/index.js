import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import BagView from '@/views/BagView.vue'
import UserFormView from '@/views/FormViews/UserFormView.vue'
import LoginView from '@/views/FormViews/LoginView.vue'
import ProfileView from '@/views/FormViews/ProfileView.vue'
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/produtos',
    name: 'produtos',
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router