import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import IntroPage from '../views/IntroPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import { useMaterialsStore } from '../stores/materials'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/intro', name: 'Intro', component: IntroPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const store = useMaterialsStore()

  // If intro not completed, force to Intro page
  if (!store.hasCompletedIntro && to.name !== 'Intro') {
    return next({ name: 'Intro' })
  }

  // If intro completed, prevent going back to Intro
  if (store.hasCompletedIntro && to.name === 'Intro') {
    return next({ name: 'Home' })
  }

  next()
})

export default router
