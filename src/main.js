import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import axios from "axios";
import Element from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';
import 'animate.css';

Vue.use(Element, { size: 'small', zIndex: 3000 });

Vue.config.productionTip = false

window.axios = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
