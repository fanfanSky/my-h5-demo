import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import { Lazyload, Image, Loading, Toast, PullRefresh, List, Cell, NavBar, Icon, Form, Field, Button, Checkbox, Popup, DatetimePicker, Dialog, Picker, Circle, Tabbar, TabbarItem, RadioGroup, Radio, Tab, Tabs, Cascader } from 'vant'; // 按需引入

Vue.use(Lazyload, { lazyComponent: true }).use(Image).use(Loading).use(Toast).use(PullRefresh).use(List).use(Cell).use(NavBar).use(Icon).
use(Form).use(Field).use(Button).use(Checkbox).use(Popup).use(DatetimePicker).use(Dialog).use(Picker).use(Circle).use(Tabbar).use(TabbarItem).use(RadioGroup).use(Radio).use(Tab).use(Tabs)
.use(Cascader);

import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '306f42e565027cf5bd169459c93d6917',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
