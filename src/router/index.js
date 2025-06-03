import { createRouter, createWebHistory } from 'vue-router'
import DesignView from '../views/DesignView.vue'

const routes = [
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