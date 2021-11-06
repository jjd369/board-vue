import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/_index.scss'
import 'reset-css'
import VueCookies from 'vue-cookies'

import locale from 'element-ui/lib/locale/lang/en'

Vue.config.productionTip = false
Vue.use(VueCookies)

Vue.use(ElementUI, { locale })

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
