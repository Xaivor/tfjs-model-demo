import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Index', component: () => import('./views/index.vue') },
  { path: '/mobileNet', name: 'MobileNet', component: () => import('./views/mobileNet.vue') },
  { path: '/handPose', name: 'handPose', component: () => import('./views/handPose.vue') },
  { path: '/moveNet', name: 'moveNet', component: () => import('./views/moveNet.vue') },
  { path: '/cocoSsd', name: 'cocoSsd', component: () => import('./views/cocoSsd.vue') },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router