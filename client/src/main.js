import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/home.css'
import './assets/styles/settings.css'
import './assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'alertifyjs/build/css/alertify.min.css'
import 'alertifyjs/build/css/themes/default.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes, faCog, faCartShopping, faInfo, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

library.add(faBars, faTimes, faCog, faCartShopping, faInfo, faPlusCircle, faMinusCircle)

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')