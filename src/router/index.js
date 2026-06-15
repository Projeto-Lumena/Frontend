import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import BagView from '@/views/BagView.vue'
import UserFormView from '@/views/FormViews/UserFormView.vue'
import LoginView from '@/views/FormViews/LoginView.vue' 
import ProfileView from '@/views/FormViews/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/produtos',
    name: 'produtos',
    component: ProductView
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: ProfileView
  },
  {
    path: '/sacola',
    name: 'sacola',
    component: BagView
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
  routes
})

export default router