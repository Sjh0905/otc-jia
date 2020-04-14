// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import PreHandler from './configs/preHandler/preHandler'
import Router from "vue-router"
import RouterConfigs from './configs/routerConfigs/routerConfigs'
import Vuex from 'vuex'
import vSelect from 'vue-select'
import StoreConfigs from './configs/storeConfigs/storeConfigs'
import NetworkInterceptors from './configs/networkConfigs/networkInterceptors'

import Network from 'vue-network-use-axios'
import address from './configs/networkConfigs/address'
import networkConfigs from './configs/networkConfigs/networkConfigs'

import EventBus from 'vue-event-bus-use-map'
import Socket from 'vue-socket-use-socket-io'
import socketConfigs from './configs/socketConfigs/socketConfigs'
import languageConfigs from './configs/languageConfigs/languageConfigs'
import Global from 'vue-global-function'
import VueI18n from 'vue-i18n'
import globalFunctionConfigs from './configs/globalFunctionConfigs/globalFunctionConfigs'

import NavigationGuards from './configs/routerConfigs/NavigationGuards'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(Vuex)
Vue.use(Network, {address, networkConfigs})
Vue.use(EventBus)
Vue.use(Socket, {url: socketConfigs.url, options: socketConfigs.options})
Vue.use(VueI18n)
Vue.use(Global, globalFunctionConfigs)
Vue.component('v-select', vSelect)
Vue.use(ElementUI);



const router = new Router(RouterConfigs)
const store = new Vuex.Store(StoreConfigs)
const i18n = new VueI18n(languageConfigs)


NavigationGuards(router, Vue.$eventBus, store, Vue.$http, Vue.cookies)
NetworkInterceptors(Vue.$http.getAxios(), Vue.$http)


if (process.env.NODE_ENV == 'production') {
  window.console.log = () => {

  }
  window.console.warn = () => {

  }
  window.console.error = () => {

  }
  window.console.debug = () => {

  }
}



// 异步加载，等待预先处理结束再挂载组件
async function mountApp() {

  await PreHandler(Vue.$http, store, Vue.cookies, i18n)

  new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: {App}
  })

}

mountApp()
