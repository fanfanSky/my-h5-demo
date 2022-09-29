import Vue from 'vue'
import VueRouter from 'vue-router'
import areaSelect from '@/views/demo_01/areaSelect.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向路由
  { path: '/', name: 'areaSelect', component: areaSelect },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
