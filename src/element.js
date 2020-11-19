import Vue from 'vue'
//导入element-ui
import { Button, Form, FormItem, Input,
     Message, Container, Header, Aside, 
     Main, Menu, Submenu, MenuItem, Breadcrumb,
      BreadcrumbItem, Card ,Row,Col,
    Table,TableColumn,Switch,Tooltip,
    Pagination,Dialog,MessageBox,
  Tag,Tree,Select,Option,Cascader} from 'element-ui'
//css样式
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//提示信息
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//提示框
Vue.prototype.$confirm=MessageBox.confirm
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)