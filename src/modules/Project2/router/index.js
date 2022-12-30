import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  // 重定向路由
  { path: '/', redirect: 'Test' },
  { path: '/Test', name: 'Test', component: () => import('../views/demo_01/Test.vue'), meta: { title: '测试', keepAlive: true } },
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === "production" ? "history" : "hash",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? ('项目2' + '-' + to.meta.title) : '项目2';
  next();
})

export default router
