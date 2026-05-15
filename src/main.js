import './assets/css/global.css'

import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000); 
    }
  },
});

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import "@fontsource/questrial";
import "@fontsource/cinzel-decorative";
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
