import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DesignView from '../views/DesignView.vue'
import DataView from '../views/DataView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/data', 
    name: 'Data',
    component: DataView
  },
  {
    path: '/design',
    name: 'Design', 
    component: DesignView
  }
]

const router = createRouter({
  history: createWebHistory('/donkey-fever-analysis/'),
  routes
})

export default router 