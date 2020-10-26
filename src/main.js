import Vue from 'vue'
import App from './App.vue'
import router from './router'
//按需导入elment-ui
import '@/element.js'

//导入全局样式表
import '../src/assets/css/global.css'
//全局注册axios
import axios from '@/api/axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 路由守卫

router.beforeEach((to, from, next) => {
  // 如果用户访问登录页 直接放行
  if(to.path==='/login'){
    return next()
  }
  //判断session中是否还有token
  const tokenStr=window.sessionStorage.getItem('token')
  //没有token，强制跳转到登录页 !tokenStr==true
  if(!tokenStr){
    return next('/login')
  }
  // 有token，放行
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
