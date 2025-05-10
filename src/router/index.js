import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/settings', name: 'Settings', component: SettingsPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
