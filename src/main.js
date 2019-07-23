// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';
import vueCookie from 'vue-cookies'
Vue.prototype.$axios = axios;
import './js/rem.js'
//公用组件导入
import Header from './components/Header'
import PaneldataGrid from './components/grid_new'
import Progress from './components/progress'
import MapHandle from './map/controls/MapHandle'
//引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入 table 和 分页组件
import {VTable,VPagination} from 'vue-easytable'

Vue.use(ElementUI)
Vue.use(vueCookie)
//inconfont字体css
import './assets/font/iconfont.css'
//公共组件全局注册
Vue.component('v-header', Header);
Vue.component('v-Paneldagrid', PaneldataGrid);
Vue.component('v-progress', Progress);
Vue.component('map-handle', MapHandle);

Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
