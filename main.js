import Vue from 'vue'
import App from './App'

import store from '@/store/index.js'
Vue.prototype.$store = store

//全局request
import request from '@/common/request'
Vue.prototype.$request = request

//通用全局混入
import baseMixin from '@/mixin/baseMixin.js'
Vue.mixin(baseMixin)


import uView from "uview-ui";
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
