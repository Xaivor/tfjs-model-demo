import Vue from 'vue'
import App from './App';
import router from './router'

import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd)

Vue.config.productionTip = false

const app = new Vue({
  router,
  render: h => h(App)
});

app.$mount('#app')

