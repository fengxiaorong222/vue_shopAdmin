import Vue from 'vue'
//导入element-ui
import {Button,Form,FormItem,Input,Message} from 'element-ui'
//css样式
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message=Message
