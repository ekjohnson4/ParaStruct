import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/home.css'
import './assets/styles/settings.css'
import './assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes, faCog, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'

library.add(faBars, faTimes, faCog, faCartShopping)

const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')