/* eslint-disable import/no-named-as-default */
import Vue from 'vue';
import LiquorTree from 'liquor-tree';
import 'vuetify/dist/vuetify.min.css';
import { sync } from 'vuex-router-sync';
// import Vuetify from 'vuetify';
import axios from 'axios';
// import VeeValidate from 'vee-validate';
import Vuelidate from 'vuelidate';
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue';
// eslint-disable-next-line import/no-named-as-default-member
import router from './router';
import store from './store/index';
import vuetify from './plugins/vuetify';
import kit from './store/kit';

Vue.prototype.kit = kit;

// import Panel from './components/Panel.vue';

// import afip from './@afipsdk/afip.js';

// require('../node_modules/bootstrap/dist/css/bootstrap.css');


Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyByz1-Aqo9l31p-ou3bYRC_7YvcY9wE0pw',
    libraries: 'places',
  },
});

axios.defaults.baseURL = 'http://127.0.0.1:3333';
axios.defaults.timeout = 5000;

Vue.use(vuetify);

/*
export default new vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      cancel: 'fas fa-ban',
      menu: 'fas fa-ellipsis-v',
    },
  },
});
*/

Vue.use(LiquorTree);
// Vue.use(VeeValidate);
Vue.use(Vuelidate);

sync(store, router);

// Vue.component('Panel', Panel);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
