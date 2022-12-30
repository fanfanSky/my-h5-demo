import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  // 重定向路由
  { path: '/', redirect: 'areaSelect' },
  { path: '/areaSelect', name: 'areaSelect', component: () => import('../views/demo_01/areaSelect.vue'), meta: { title: '页面标题1', keepAlive: true } },
  // 高德地图自动定位
  { path: '/AMapIndex', name: 'AMapIndex', component: () => import('../views/AMap/AMapIndex.vue'), meta: { title: '', keepAlive: false } },
  { path: '/Map', name: 'Map', component: () => import('../views/AMap/Map.vue'), meta: { title: '', keepAlive: false } },
  // 人脸识别
  { path: '/Face', name: 'Face', component: () => import('../views/FaceRecognition/index.vue'), meta: { title: '', keepAlive: false } },
  
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === "production" ? "history" : "hash",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? ('项目1' + '-' + to.meta.title) : '项目1';
  next();
})

export default router
