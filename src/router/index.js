import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DesignView from '../views/DesignView.vue'
import ContentView from '../views/ContentView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/content',
    name: 'Content',
    component: ContentView
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