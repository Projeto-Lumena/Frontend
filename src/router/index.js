import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import UserView from '@/views/UserView.vue'
import BagView from '@/views/BagView.vue'

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
    component: UserView
  },
  {
    path: '/sacola',
    name: 'sacola',
    component: BagView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router